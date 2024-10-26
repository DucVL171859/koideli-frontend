import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Divider,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate, useParams } from 'react-router-dom';
import orderServices from 'services/orderServices';
import koiFishServices from 'services/koiFishServices';
import orderDetailServices from 'services/orderDetailServices';
import boxOptionServices from 'services/boxOptionServices';
import distanceServices from 'services/distanceServices';

const OrderDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});
    const [orderDetail, setOrderDetail] = useState([]);
    const [currentOrderDetail, setCurrentOrderDetail] = useState([]);
    const [boxOption, setBoxOption] = useState([]);
    const [koiFist, setKoiFist] = useState([]);
    const [distance, setDistance] = useState({});

    const statusMessages = {
        Pending: 'Đơn hàng mới',
        Approved: 'Đã xác nhận',
        Packed: 'Chờ sắp xếp chuyến',
        Delivering: 'Đang vận chuyển',
        Completed: 'Đã giao thành công',
        Cancelled: 'Giao không thành công',
    };

    const statusColors = {
        Pending: '#fff3e6',
        Approved: '#e6f7ff',
        Packed: '#fff7e6',
        Delivering: '#e6fffa',
        Completed: '#d9f7be',
        Cancelled: '#ffccc7',
    };

    useEffect(() => {
        const getOrder = async () => {
            let resOfOrder = await orderServices.getOrderById(slug);
            if (resOfOrder) {
                let orderData = resOfOrder.data.data;
                setOrder(orderData);
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

    return (
        <MainCard>
            <Typography variant="h4" align="left" gutterBottom>
                Trạng thái đơn hàng: {statusMessages[order.isShipping] || 'Không xác định'}
            </Typography>

            <Box sx={{ backgroundColor: statusColors[order.isShipping], padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h6">Thông tin gửi nhận</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                    <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'start' }}>
                        <Typography variant="subtitle1">Người gửi: {order.senderName}</Typography>
                        <Typography variant="subtitle1">Địa chỉ gửi: {order.senderAddress}</Typography>
                    </Paper>
                    <Box sx={{ width: '2px', height: '100%', backgroundColor: 'grey.400', margin: '0 16px' }} />
                    <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'start' }}>
                        <Typography variant="subtitle1">Người nhận: {order.receiverName} / {order.receiverPhone}</Typography>
                        <Typography variant="subtitle1">Địa chỉ nhận: {order.receiverAddress}</Typography>
                    </Paper>
                </Box>
            </Box>

            <Divider sx={{ marginBottom: 2 }} />

            <Box sx={{ backgroundColor: statusColors[order.isShipping], padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h6">Thông tin cá Koi</Typography>
                <Typography>Tổng số lượng cá: {totalQuantity}</Typography>
                <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'start' }}>
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        {boxOption.map((option, index) => (
                            option.fishes.map((fish, fishIndex) => {
                                const koi = koiFist.find(koi => koi.id === fish.fishId);
                                return (
                                    koi && (
                                        <Box key={`${index}-${fishIndex}`} display="flex" justifyContent="space-between" marginTop={2}>
                                            <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'center' }}>
                                                <Typography variant="subtitle1">Kích thước: {koi.size}</Typography>
                                                <Typography variant="h5">Số lượng: {fish.quantity}</Typography>
                                            </Paper>
                                        </Box>
                                    )
                                );
                            })
                        ))}
                    </Box>
                    <Box display="flex" justifyContent="space-around" marginTop={2}>
                        {[order.urlCer1, order.urlCer2, order.urlCer3, order.urlCer4].map((url, index) => (
                            <Paper key={index} sx={{ width: '100px', height: '100px', padding: 1, textAlign: 'center' }}>
                                <img src={url} alt={`Koi Fish ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                            </Paper>
                        ))}
                    </Box>
                </Paper>
            </Box>

            <Divider sx={{ marginBottom: 2 }} />

            <Box sx={{ backgroundColor: statusColors[order.isShipping], padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h6">Thông tin đóng gói</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Loại Hộp</TableCell>
                                <TableCell align="right">Chi phí từ Nhật</TableCell>
                                <TableCell align="right">Chi phí trong nước</TableCell>
                                <TableCell align="right">Loại Cá Được Đóng Gói</TableCell>
                                <TableCell align="right">Tổng thể tích cá/hộp</TableCell>
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
                                        {(() => {
                                            let newPrice = 0;
                                            if (boxOption.boxName) {
                                                if (boxOption.boxName.includes('Medium')) {
                                                    newPrice = distance.price + 150000;
                                                } else if (boxOption.boxName.includes('Large')) {
                                                    newPrice = distance.price + 350000;
                                                }
                                            }
                                            return newPrice.toLocaleString();
                                        })()} VND
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

            <Box sx={{ backgroundColor: statusColors[order.isShipping], padding: 2, borderRadius: 1, marginBottom: 2 }}>
                <Typography variant="h6">Thông tin chi phí</Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Loại Chi Phí</TableCell>
                                <TableCell align="right">Giá</TableCell>
                                <TableCell align="right">Mô Tả</TableCell>
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
        </MainCard>
    );
};

export default OrderDetail;