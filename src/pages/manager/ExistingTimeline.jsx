import React, { Fragment, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    TextField,
    MenuItem,
    Button,
    InputLabel,
    Select,
    Checkbox,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
} from "@mui/material";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import branchServices from 'services/branchServices';
import { useNavigate } from 'react-router-dom';
import orderServices from 'services/orderServices';
import orderDetailServices from 'services/orderDetailServices';
import { toast } from 'react-toastify';
import deliveryServices from 'services/deliveryServices';
import boxServices from 'services/boxServices';

const formatDateTime = (dateString) => {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', options).replace(',', '');
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'Pending':
            return 'Chưa hoạt động';
        case 'Delivering':
            return 'Đang hoạt động';
        case 'Completed':
            return 'Hoàn thành';
        default:
            return 'Không xác định';
    }
};

const StatusCircle = ({ status }) => {
    let color;
    switch (status) {
        case 'Pending':
            color = '#b3b37e';
            break;
        case 'Delivering':
            color = '#66cbec';
            break;
        case 'Completed':
            color = '#66ec9e';
            break;
        default:
            color = 'gray';
    }

    return (
        <span
            style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: color,
                marginRight: '5px',
            }}
        />
    );
};

const ExistingTimelines = () => {
    const navigate = useNavigate();

    const [existingTimelines, setExistingTimelines] = useState([]);
    const [timelines, setTimelines] = useState([]);
    const [suitableTimeline, setSuitableTimeline] = useState([]);

    const [branches, setBranches] = useState([]);
    const [selectedBranches, setSelectedBranches] = useState([]);

    const [startDate, setStartDate] = useState('');

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState('');
    const [orderDetails, setOrderDetails] = useState([]);
    const [matchedOrderDetails, setMatchedOrderDetails] = useState([]);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);

    const [boxes, setBoxes] = useState([]);

    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getBranches(),
                    getExistingTimelines(),
                    getOrders(),
                    getOrderDetails(),
                    getBoxes()
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getExistingTimelines = async () => {
        let resOfExistingTimeline = await timelineDeliveryServices.getTimelineDeliveryEnable();
        if (resOfExistingTimeline.data.data) {
            setExistingTimelines(resOfExistingTimeline.data.data);
        }
    };

    const getBranches = async () => {
        let resOfBranches = await branchServices.getBranch();
        if (resOfBranches.data.data) {
            setBranches(resOfBranches.data.data);
        }
    };

    const getOrders = async () => {
        let resOfOrders = await orderServices.getOrder();
        if (resOfOrders.data.data) {
            let packedOrder = resOfOrders.data.data.filter(order => order.isShipping === 'Packed');
            setOrders(packedOrder);
        }
    };

    const getOrderDetails = async () => {
        let resOfOrderDetails = await orderDetailServices.getOrderDetail();
        if (resOfOrderDetails.data.data) {
            setOrderDetails(resOfOrderDetails.data.data);
        }
    }

    const getBoxes = async () => {
        let resOfBoxes = await boxServices.getBox();
        if (resOfBoxes.data) {
            setBoxes(resOfBoxes.data);
        }
    }

    const handleBranchChange = (event) => {
        const value = event.target.value;
        setSelectedBranches(value);
    };

    const handleOrderChange = (event) => {
        let orderId = event.target.value;
        setSelectedOrder(orderId);
        let matchedOrderDetails = orderDetails.filter(orderDetail => orderDetail.orderId === orderId);
        setMatchedOrderDetails(matchedOrderDetails);
        setSelectedOrderDetails([]);
        setDialogOpen(true);
    };

    const handleStartDateChange = (event) => {
        let date = event.target.value;
        setStartDate(date);
    };

    const handleCheckboxChange = (detailId) => {
        setSelectedOrderDetails((prevSelected) => {
            if (prevSelected.includes(detailId)) {
                return prevSelected.filter(id => id !== detailId);
            } else {
                return [...prevSelected, detailId];
            }
        });
    };

    const handleAcceptOrderDetails = () => {
        setDialogOpen(false);
    };

    const handleFilterTimelines = async () => {
        if (selectedBranches.length === 0 || !selectedOrder || !startDate) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        let resOfSuitableTimelines = await deliveryServices.getSuitableTimeline(selectedOrderDetails[0], selectedBranches, startDate);
        if (resOfSuitableTimelines.data.data) {
            let groupedTimelines = resOfSuitableTimelines.data.data.map(vehicleTimeline => ({
                vehicle: vehicleTimeline,
                timelines: vehicleTimeline.timelines
            }));
            setSuitableTimeline(groupedTimelines);
        } else {
            toast.error('Không có lịch nào phù hợp');
        }
    };

    const handleViewDetail = (slug) => {
        navigate(`/manager/timeline/${slug}/create-order-timeline`);
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <FormControl margin="normal" sx={{ width: '300px', mb: 2 }}>
                        <InputLabel id="branch-select-label">Chọn Chuyến Nhỏ</InputLabel>
                        <Select
                            labelId="branch-select-label"
                            multiple
                            value={selectedBranches}
                            onChange={handleBranchChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {branches.map((branch) => (
                                <MenuItem key={branch.id} value={branch.id}>
                                    <Checkbox checked={selectedBranches.indexOf(branch.id) > -1} />
                                    <ListItemText primary={`${branch.id} - ${branch.name}`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl margin="normal" sx={{ width: '300px', mb: 2 }}>
                        <InputLabel id="order-select-label">Chọn Đơn Hàng</InputLabel>
                        <Select
                            labelId="order-select-label"
                            value={selectedOrder}
                            onChange={(e) => handleOrderChange(e)}
                            MenuProps={{
                                PaperProps: {
                                    role: 'menu',
                                    'aria-hidden': false,
                                },
                            }}
                        >
                            {orders && orders.map((order) => (
                                <MenuItem key={order.id} value={order.id}>
                                    {order.id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        margin="normal"
                        label="Chọn Ngày Bắt Đầu"
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ width: '300px', mt: 2 }}
                    />
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFilterTimelines}
                    sx={{ ml: 2 }}
                >
                    Tìm lịch phù hợp
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Xe</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Các chuyến nhỏ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Dự kiến bắt đầu - kết thúc</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Sức chứa hiện tại</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Đề xuất</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            suitableTimeline && suitableTimeline.map((vehicleTimeline, index) => (
                                <Fragment key={index}>
                                    {
                                        vehicleTimeline.timelines.map(timeline => (
                                            <TableRow key={timeline.timelineId}>
                                                <TableCell>{timeline.timelineId}</TableCell>
                                                {timeline === vehicleTimeline.timelines[0] && (
                                                    <TableCell rowSpan={vehicleTimeline.timelines.length}>{vehicleTimeline.vehicle.vehicleName}</TableCell>
                                                )}
                                                <TableCell>{timeline.branchName || 'Không xác định'}</TableCell>
                                                <TableCell>{formatDateTime(timeline.startDate)} - {formatDateTime(timeline.endDate)}</TableCell>
                                                <TableCell>{timeline.currentVolume || '0'} / {vehicleTimeline.vehicle.vehicleVolume || ''} lít</TableCell>
                                                <TableCell>
                                                    {
                                                        boxes && (
                                                            <>
                                                                {(() => {
                                                                    let mediumTotal = 0;
                                                                    let largeTotal = 0;

                                                                    boxes.forEach(box => {
                                                                        if (box.name.includes('Medium - VN')) {
                                                                            mediumTotal += box.maxVolume;
                                                                        } else if (box.name.includes('Large - VN')) {
                                                                            largeTotal += box.maxVolume;
                                                                        }
                                                                    });

                                                                    const maxMediumQuantity = Math.floor(timeline.remainingVolume / 50);
                                                                    const maxLargeQuantity = Math.floor(timeline.remainingVolume / 90)

                                                                    return (
                                                                        <>
                                                                            <div>Có thể thêm tối đa {maxMediumQuantity} hộp Medium</div>
                                                                            <div>Hoặc</div>
                                                                            <div>Có thể thêm tối đa {maxLargeQuantity} hộp Large</div>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </>
                                                        )
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <StatusCircle status={timeline.isComplete} />
                                                    {getStatusLabel(timeline.isComplete)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleViewDetail(timeline.timelineId)}
                                                    >
                                                        Xem Chi Tiết
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </Fragment>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Chi Tiết Đơn Hàng</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox
                                        checked={matchedOrderDetails.every(detail => selectedOrderDetails.includes(detail.id))}
                                        onChange={(event) => {
                                            let checked = event.target.checked;
                                            setSelectedOrderDetails(checked ? matchedOrderDetails.map(detail => detail.id) : []);
                                        }}
                                    />
                                </TableCell>
                                <TableCell>Mã đơn hàng</TableCell>
                                <TableCell>Mã vận đơn</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matchedOrderDetails && matchedOrderDetails.map((detail) => (
                                <TableRow key={detail.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedOrderDetails.includes(detail.id)}
                                            onChange={() => handleCheckboxChange(detail.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{selectedOrder}</TableCell>
                                    <TableCell>{detail.id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAcceptOrderDetails}>Chấp Nhận</Button>
                    <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ExistingTimelines;