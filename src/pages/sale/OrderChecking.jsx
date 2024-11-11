import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Divider,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
} from '@mui/material';

import { CloseOutlined, DeleteOutline } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { useNavigate, useParams } from 'react-router-dom';
import orderServices from 'services/orderServices';
import koiFishServices from 'services/koiFishServices';
import orderDetailServices from 'services/orderDetailServices';
import boxOptionServices from 'services/boxOptionServices';
import distanceServices from 'services/distanceServices';
import { toast } from 'react-toastify';
import { PriceFormat } from 'utils/tools';

const OrderChecking = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});
    const [orderDetail, setOrderDetail] = useState([]);
    const [currentOrderDetail, setCurrentOrderDetail] = useState([]);
    const [boxOption, setBoxOption] = useState([]);
    const [koiFist, setKoiFist] = useState([]);
    const [distance, setDistance] = useState({});

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState('');

    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedOrder, setEditedOrder] = useState({
        senderName: '',
        senderAddress: '',
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
    });

    const [newFish, setNewFish] = useState({ fishId: '', quantity: 1 });

    const statusMessages = {
        Pending: 'Đơn hàng mới',
        Approved: 'Đã xác nhận',
        Packed: 'Chờ sắp xếp chuyến',
        Delivering: 'Đang vận chuyển',
        Completed: 'Đã giao thành công',
        Cancelled: 'Giao không thành công',
    };

    const statusColors = {
        Pending: '#e69b4b',
        Approved: '#4186f9',
        Packed: '#ab935e',
        Delivering: '#4a89d7',
        Completed: '#79ff00',
        Cancelled: '#ff072e',
    };

    useEffect(() => {
        const getOrder = async () => {
            let resOfOrder = await orderServices.getOrderById(slug);
            if (resOfOrder) {
                let orderData = resOfOrder.data.data;
                setOrder(orderData);
                setEditedOrder({
                    senderName: orderData.senderName,
                    senderAddress: orderData.senderAddress,
                    receiverName: orderData.receiverName,
                    receiverPhone: orderData.receiverPhone,
                    receiverAddress: orderData.receiverAddress,
                });
                getOrderDetail(orderData.id);
            }
        };

        const getOrderDetail = async (orderId) => {
            let resOfOrderDetail = await orderDetailServices.getOrderDetail();
            if (resOfOrderDetail) {
                let orderDetailData = resOfOrderDetail.data.data;
                setOrderDetail(orderDetailData);

                let matchedOrderDetail = orderDetailData.filter(detail => detail.orderId === orderId);
                setCurrentOrderDetail(matchedOrderDetail);
                matchedOrderDetail.forEach(detail => {
                    getBoxOption(detail.boxOptionId);
                });

                getDistance(matchedOrderDetail[0].distanceId);
            }
        };

        const getBoxOption = async (boxOptionId) => {
            let resOfBoxOption = await boxOptionServices.getBoxOption();
            if (resOfBoxOption) {
                let matchedBoxOption = resOfBoxOption.data.data.find(option => option.boxOptionId === boxOptionId);
                if (matchedBoxOption) {
                    setBoxOption(prevOptions => [...prevOptions, matchedBoxOption]);
                    if (matchedBoxOption.fishes && Array.isArray(matchedBoxOption.fishes)) {
                        for (const fish of matchedBoxOption.fishes) {
                            await getKoiFish(fish.fishId);
                        }
                    }
                }
            }
        };

        const getKoiFish = async (fishId) => {
            let resOfKoiFish = await koiFishServices.getKoiFishById(fishId);
            if (resOfKoiFish) {
                setKoiFist(prevKoiFish => [...prevKoiFish, resOfKoiFish.data.data]);
            }
        };

        getOrder();
    }, [slug]);

    const getDistance = async (distanceId) => {
        let resOfDistance = await distanceServices.getDistanceById(distanceId);
        if (resOfDistance) {
            setDistance(resOfDistance.data.data);
        }
    }

    const totalQuantity = boxOption.reduce((total, option) => {
        const fishQuantities = option.fishes.reduce((sum, fish) => sum + fish.quantity, 0);
        return total + fishQuantities;
    }, 0);

    const handleOpenDialog = (action) => {
        setDialogAction(action);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleImageClick = (url) => {
        setSelectedImage(url);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedImage(null);
    };

    const handleConfirmAction = async () => {
        if (dialogAction === 'accept') {
            await orderServices.updateOrder(order.id,
                { ...order, isShipping: 'Approved' }
            );
            toast.success('Xác nhận đơn hàng thành công')
        } else if (dialogAction === 'reject') {
            await orderServices.updateOrder(order.id,
                { ...order, isShipping: 'Cancelled' }
            );
            toast.success('Đã từ chối đơn hàng')
        }
        setOpenDialog(false);
        navigate('/sale/order');
    };

    const status = order.isShipping || 'Pending';
    const statusMessage = statusMessages[status] || 'Không xác định';
    const statusColor = statusColors[status] || '#fff';

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedOrder({
            ...editedOrder,
            [name]: value,
        });
    };

    const handleSaveClick = () => {
        toast.success('Lưu thành công');
        setIsEditing(false);
    };

    const handleSaveKoiFishClick = () => {
        toast.success('Lưu thành công');
        setIsEditing(false);
    }

    const handleAddFish = () => {
        setKoiFist(prevFishes => [...prevFishes, { ...newFish }]);
        setNewFish({ fishId: '', quantity: 1 });
    };

    const handleDeleteFish = (index) => {
        setKoiFist(prevFishes => prevFishes.filter((_, i) => i !== index));
    };

    return (
        <MainCard>
            <Typography
                variant="h5"
                align="left"
                gutterBottom
                sx={{
                    border: `2px solid ${statusColor}`,
                    borderRadius: '10px',
                    p: 2,
                    width: 'fit-content',
                    color: `${statusColor}`,
                }}
            >
                {statusMessage}
            </Typography>

            <Typography
                variant="h5"
                align="left"
                gutterBottom
                sx={{
                    border: `2px solid #000`,
                    borderRadius: '10px',
                    p: 2,
                    width: 'fit-content',
                    color: `#000`,
                }}
            >
                {order.isPayment ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </Typography>

            <Box sx={{ backgroundColor: '#86b3b1', padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Thông tin gửi nhận</Typography>
                    <Box>
                        {!isEditing && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                sx={{ padding: '6px 16px' }}
                                onClick={handleEditClick}
                            >
                                Chỉnh sửa
                            </Button>
                        )}
                        {isEditing && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                sx={{ padding: '6px 16px' }}
                                onClick={handleSaveClick}
                            >
                                Lưu
                            </Button>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'start' }}>
                        <Typography variant="subtitle1">Người gửi:</Typography>
                        <TextField
                            name="senderName"
                            value={order.senderName || ''}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            disabled={!isEditing}
                            sx={{ marginBottom: 1 }}
                        />
                        <Typography variant="subtitle1">Địa chỉ gửi:</Typography>
                        <TextField
                            name="senderAddress"
                            value={editedOrder.senderAddress || ''}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            disabled={!isEditing}
                        />
                    </Paper>

                    <Box sx={{ width: '2px', height: '100%', backgroundColor: 'grey.400', margin: '0 16px' }} />

                    <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'start' }}>
                        <Typography variant="subtitle1">Người nhận:</Typography>
                        <Box display='flex' justifyContent='space-between'>
                            <TextField
                                name="receiverName"
                                value={editedOrder.receiverName || ''}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                disabled={!isEditing}
                                sx={{ marginBottom: 1, marginRight: 1 }}
                            />
                            <TextField
                                name="receiverPhone"
                                value={editedOrder.receiverPhone || ''}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                disabled={!isEditing}
                                sx={{ marginBottom: 1 }}
                            />
                        </Box>
                        <Typography variant="subtitle1">Địa chỉ nhận:</Typography>
                        <TextField
                            name="receiverAddress"
                            value={editedOrder.receiverAddress || ''}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            disabled={!isEditing}
                        />
                    </Paper>
                </Box>
            </Box>

            <Divider sx={{ marginBottom: 2 }} />

            <Box sx={{ backgroundColor: '#86b3b1', padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6">Thông tin cá Koi</Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>Tổng số lượng cá: {totalQuantity}</Typography>
                    </Box>
                    <Box>
                        {isEditing && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                sx={{ padding: '6px 16px', mr: 2 }}
                                onClick={handleAddFish}
                            >
                                Thêm cá
                            </Button>
                        )}
                        {!isEditing && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                sx={{ padding: '6px 16px' }}
                                onClick={handleEditClick}
                            >
                                Chỉnh sửa
                            </Button>
                        )}
                        {isEditing && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                sx={{ padding: '6px 16px' }}
                                onClick={handleSaveKoiFishClick}
                            >
                                Lưu
                            </Button>
                        )}
                    </Box>

                </Box>
                <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'start' }}>
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }}>Kích thước</TableCell>
                                    <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }}>Số lượng</TableCell>
                                    {isEditing && <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }}></TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    boxOption && boxOption.map((option, index) => (
                                        option.fishes.map((fish, fishIndex) => {
                                            let koi = koiFist.find(koi => koi.id === fish.fishId);
                                            return (
                                                koi && (
                                                    <TableRow key={`${index}-${fishIndex}`}>
                                                        <TableCell>
                                                            <TextField
                                                                value={koi.size}
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                disabled={!isEditing}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                value={fish.quantity}
                                                                variant="outlined"
                                                                size="small"
                                                                fullWidth
                                                                disabled={!isEditing}
                                                                onChange={(e) => {
                                                                    const updatedFish = [...koiFist];
                                                                    updatedFish[index].quantity = e.target.value;
                                                                    setKoiFist(updatedFish);
                                                                }}
                                                            />
                                                        </TableCell>
                                                        {isEditing && (
                                                            <TableCell>
                                                                <IconButton onClick={() => handleDeleteFish(index)}>
                                                                    <DeleteOutline />
                                                                </IconButton>
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                )
                                            )
                                        })
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <Box display="flex" justifyContent="space-around" marginTop={2}>
                    {[order.urlCer1, order.urlCer2, order.urlCer3, order.urlCer4].map((url, index) => (
                        <Paper key={index} sx={{ width: '100px', height: '100px', padding: 1, textAlign: 'center' }}>
                            <img src={url} alt={`Koi Fish ${index + 1}`} style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                                onClick={() => handleImageClick(url)}
                            />
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Divider sx={{ marginBottom: 2 }} />

            <Box sx={{ backgroundColor: '#86b3b1', padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h6">Thông tin đóng gói</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }}>Loại Hộp</TableCell>
                                <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }} align="right">Chi phí từ Nhật</TableCell>
                                <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }} align="right">Chi phí trong nước</TableCell>
                                <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }} align="right">Giá hộp nội địa</TableCell>
                                <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }} align="right">Loại Cá Được Đóng Gói</TableCell>
                                <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }} align="right">Tổng thể tích cá/hộp</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {boxOption && boxOption.map((boxOption) => (
                                <TableRow key={boxOption.boxOptionId}>
                                    <TableCell>{boxOption.boxName}</TableCell>
                                    <TableCell align="right">
                                        {boxOption.boxName && boxOption.boxName.includes('JP') ? `${boxOption.price.toLocaleString()} VND` : '0 VND'}
                                    </TableCell>
                                    <TableCell align="right">
                      <PriceFormat price={distance.price} />
                    </TableCell>
                    <TableCell align="right">
                      {boxOption.boxName && boxOption.boxName.includes("VN")
                        ? `${boxOption.price.toLocaleString()} VND`
                        : "0 VND"}
                    </TableCell>
                                    <TableCell align="right">
                                        {boxOption.fishes.map((fish) => (
                                            <Box key={fish.fishId}>
                                                {fish.quantity}x {fish.fishDescription} ({fish.fishSize} cm)
                                            </Box>
                                        ))}
                                    </TableCell>
                                    <TableCell align="right">{boxOption.totalVolume}/{boxOption.maxVolume} lít</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Divider sx={{ marginBottom: 2 }} />

            <Box sx={{ backgroundColor: '#86b3b1', padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h6">Thông tin chi phí</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }}>Loại Chi Phí</TableCell>
                                <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }} align="right">Giá</TableCell>
                                <TableCell sx={{ bgcolor: 'rgb(241 141 154 / 87%)' }} align="right">Mô Tả</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell><strong>Tổng chi phí</strong></TableCell>
                                <TableCell align="right">
                                    <strong>
                                        {order.totalFee && order.totalFee.toLocaleString()} VND
                                    </strong>
                                </TableCell>
                                <TableCell align="right">Đã bao gồm thuế VAT</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box display="flex" justifyContent="center" marginTop={2}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenDialog('reject')}
                    sx={{ marginRight: 4 }}
                >
                    Từ chối
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleOpenDialog('accept')}
                >
                    Xác nhận
                </Button>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn {dialogAction === 'accept' ? 'xác nhận' : 'từ chối'} đơn hàng này?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmAction} color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogActions>
                    <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseOutlined />
                    </IconButton>
                </DialogActions>
                <DialogContent>
                    <img src={selectedImage} alt="Enlarged view" style={{ width: '100%', height: 'auto' }} />
                </DialogContent>
            </Dialog>
        </MainCard>
    );
};

export default OrderChecking;