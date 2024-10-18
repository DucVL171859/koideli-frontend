import React, { useEffect, useState } from "react";
import {
    Typography,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    ListItemText,
} from "@mui/material";
import MainCard from "components/MainCard";
import orderServices from "services/orderServices";
import orderDetailServices from "services/orderDetailServices";
import branchServices from "services/branchServices";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import vehicleServices from "services/vehicleServices";
import boxOptionServices from "services/boxOptionServices";

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

const Timeline = () => {
    const [orders, setOrders] = useState([]);
    const [orderDetailsMap, setOrderDetailsMap] = useState({});
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [vehicles, setVehicles] = useState({});
    const [timelineDelivery, setTimelineDelivery] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState({});
    const [boxOptions, setBoxOptions] = useState({});

    useEffect(() => {
        const getOrders = async () => {
            let resOfOrder = await orderServices.getOrder();
            if (resOfOrder) {
                let approvedOrders = resOfOrder.data.data.filter((order) => order.isShipping === 'Approved');
                setOrders(approvedOrders);

                const detailsPromises = approvedOrders.map(order => getOrderDetails(order.id));
                await Promise.all(detailsPromises);
            }
        };

        const getOrderDetails = async (orderId) => {
            let resOfOrderDetail = await orderDetailServices.getOrderDetail();
            if (resOfOrderDetail) {
                let orderDetailData = resOfOrderDetail.data.data;
                let matchedOrderDetail = orderDetailData.filter(detail => detail.orderId === orderId);
                setOrderDetailsMap(prevDetails => ({
                    ...prevDetails,
                    [orderId]: matchedOrderDetail
                }));
            }
        };

        const getBranch = async () => {
            let resOfBranch = await branchServices.getBranch();
            if (resOfBranch) {
                setBranches(resOfBranch.data.data);
            }
        };

        const getVehicles = async () => {
            let resOfVehicle = await vehicleServices.getVehicle();
            if (resOfVehicle) {
                const vehicleMap = {};
                resOfVehicle.data.data.forEach(vehicle => {
                    vehicleMap[vehicle.id] = vehicle;
                });
                setVehicles(vehicleMap);
            }
        };

        const getBoxOptions = async () => {
            let resOfBoxOptions = await boxOptionServices.getBoxOption();
            if (resOfBoxOptions) {
                const boxOptionMap = {};
                resOfBoxOptions.data.data.forEach(boxOption => {
                    boxOptionMap[boxOption.id] = boxOption;
                });
                setBoxOptions(boxOptionMap);
            }
        };

        getOrders();
        getBranch();
        getVehicles();
        getBoxOptions();
    }, []);

    const handleBranchChange = async (event) => {
        const branchId = event.target.value;
        setSelectedBranch(branchId);

        let resOfTimelineDelivery = await timelineDeliveryServices.getTimelineDelivery();
        if (resOfTimelineDelivery) {
            let timelineDeliveryData = resOfTimelineDelivery.data.data;
            let matchedTimeline = timelineDeliveryData.filter(timeline => timeline.branchId === branchId);
            if (matchedTimeline) {
                setTimelineDelivery(matchedTimeline);
            }
        }
    };

    const handleOrderSelectChange = (timelineId, event) => {
        const { value } = event.target;
        setSelectedOrders(prev => ({
            ...prev,
            [timelineId]: value,
        }));
    };

    const calculateEstimatedVolume = (timelineId) => {
        const selectedOrderIds = selectedOrders[timelineId] || [];
        let totalVolume = 0;

        selectedOrderIds.forEach(orderId => {
            const orderDetails = orderDetailsMap[orderId] || [];
            console.log(orderDetails)
            orderDetails.forEach(detail => {
                const boxOption = boxOptions[detail.boxOptionId] || [];
                console.log(boxOption)
                if (boxOption && boxOption.volume) {
                    totalVolume += boxOption.volume;
                }
            });
        });
        return totalVolume;
    };

    return (
        <>
            <MainCard title="Đơn hàng chờ sắp xếp vận chuyển">
                <Box display="flex" flexWrap="wrap" justifyContent="start">
                    {orders.map((order) => (
                        <Box key={order.id} sx={{ width: '30%', margin: '1%', border: '1px solid #ccc', borderRadius: '4px', padding: '16px' }}>
                            <Typography variant="h6">ID: {order.id}</Typography>
                            <Typography>Người nhận: {order.receiverName}</Typography>
                            <Typography>Địa chỉ nhận: {order.receiverAddress}</Typography>

                            <Box sx={{ marginTop: 2 }}>
                                {orderDetailsMap[order.id] && orderDetailsMap[order.id].map(detail => (
                                    <Box key={detail.id} sx={{ padding: '8px', border: '1px solid #e0e0e0', margin: '4px 0' }}>
                                        <Typography>Mã hộp: {detail.id}</Typography>
                                        <Typography>Tổng số cá: {detail.boxOptionId}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </MainCard>

            <MainCard title="Lịch trình" sx={{ mt: 2 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="branch-select-label">Chọn tuyến</InputLabel>
                    <Select
                        labelId="branch-select-label"
                        value={selectedBranch}
                        onChange={handleBranchChange}
                    >
                        {branches.map((branch) => (
                            <MenuItem key={branch.id} value={branch.id}>
                                {branch.startPoint} - {branch.endPoint}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Xe</TableCell>
                                <TableCell>Dự kiến bắt đầu - kết thúc</TableCell>
                                <TableCell>Sức chứa tối đa</TableCell>
                                <TableCell>Chọn Đơn hàng</TableCell>
                                <TableCell>Sức chứa dự kiến</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timelineDelivery.map((timeline) => (
                                <TableRow key={timeline.id}>
                                    <TableCell>{vehicles[timeline.vehicleId]?.name}</TableCell>
                                    <TableCell>{formatDateTime(timeline.startDay)} - {formatDateTime(timeline.endDay)}</TableCell>
                                    <TableCell>{vehicles[timeline.vehicleId]?.vehicleVolume} lít</TableCell>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                multiple
                                                value={selectedOrders[timeline.id] || []}
                                                renderValue={(selected) => selected.join(', ')}
                                                onChange={(event) => handleOrderSelectChange(timeline.id, event)}
                                            >
                                                {orders.map((order) => (
                                                    <MenuItem key={order.id} value={order.id}>
                                                        <Checkbox
                                                            checked={selectedOrders[timeline.id]?.includes(order.id) || false}
                                                        />
                                                        <ListItemText primary={`ID: ${order.id}`} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        {calculateEstimatedVolume(timeline.id)} lít
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
        </>
    );
};

export default Timeline;