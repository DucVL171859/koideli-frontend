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
    Button, // Import Button
} from "@mui/material";
import MainCard from "components/MainCard";
import orderServices from "services/orderServices";
import orderDetailServices from "services/orderDetailServices";
import vehicleServices from "services/vehicleServices";
import boxOptionServices from "services/boxOptionServices";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import branchServices from "services/branchServices";

const sampleBranch = [
    { id: 1, name: 'Kho Cần Thơ', forward: 1, backward: null },
    { id: 2, name: 'Kho Hồ Chí Minh', forward: 3, backward: 2 },
    { id: 3, name: 'Kho Đà Nẵng', forward: 5, backward: 4 },
    { id: 4, name: 'Kho Hải Phòng', forward: 7, backward: 6 },
    { id: 5, name: 'Kho Hà Nội', forward: null, backward: 8 }
];

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
    const [selectedOrders, setSelectedOrders] = useState({});
    const [boxOptions, setBoxOptions] = useState({});

    const [branches, setBranches] = useState([]);
    const [branchesAPI, setBranchesAPI] = useState([]);
    const [branchPointAPI, setBranchPointAPI] = useState([]);
    const [selectedStartPoint, setSelectedStartPoint] = useState(null);
    const [selectedEndPoint, setSelectedEndPoint] = useState(null);

    const [vehicles, setVehicles] = useState([]);
    const [timelineDelivery, setTimelineDelivery] = useState([]);
    const [filteredTimelines, setFilteredTimelines] = useState([]);

    const [error, setError] = useState("");

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

        const getVehicles = async () => {
            let resOfVehicle = await vehicleServices.getVehicle();
            if (resOfVehicle) {
                setVehicles(resOfVehicle.data.data);
            }
        };

        const getBranches = async () => {
            let resOfBranch = await branchServices.getBranch();
            if (resOfBranch) {
                setBranchesAPI(resOfBranch.data.data);
            }
        }

        const getTimelineDelivery = async () => {
            let resOfTimelineDelivery = await timelineDeliveryServices.getTimelineDelivery();
            if (resOfTimelineDelivery) {
                setTimelineDelivery(resOfTimelineDelivery.data.data);
            }
        }

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

        setBranches(sampleBranch);
        getOrders();
        getVehicles();
        getBranches();
        getTimelineDelivery();
        getBoxOptions();
    }, []);

    useEffect(() => {
        if (selectedStartPoint === selectedEndPoint) {
            setError("Điểm bắt đầu và điểm kết thúc không thể giống nhau.");
        } else {
            setError("");
        }
    }, [selectedStartPoint, selectedEndPoint]);

    const handleStartPointChange = (event) => {
        let selStartPoint = sampleBranch.find(branch => branch.name === event.target.value);
        setSelectedStartPoint(selStartPoint);
    };

    const handleEndPointChange = (event) => {
        let selEndPoint = sampleBranch.find(branch => branch.name === event.target.value);
        setSelectedEndPoint(selEndPoint);
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
            orderDetails.forEach(detail => {
                const boxOption = boxOptions[detail.boxOptionId] || {};
                if (boxOption && boxOption.volume) {
                    totalVolume += boxOption.volume;
                }
            });
        });
        return totalVolume;
    };

    const handleCreateTrip = async () => {
        if (selectedStartPoint && selectedEndPoint && selectedStartPoint !== selectedEndPoint) {
            let startIndex = sampleBranch.findIndex(branch => branch.id === selectedStartPoint.id);
            let endIndex = sampleBranch.findIndex(branch => branch.id === selectedEndPoint.id);

            let middleBranches = [];
            let allBranches = [];
            let startBranch = {};

            if (startIndex < endIndex) {
                console.log('forward')
                startBranch = branchesAPI.find(branch => branch.id === selectedStartPoint.forward);
                middleBranches = sampleBranch.slice(startIndex + 1, endIndex);
                let fetchedRestBranches = middleBranches.map(branch => {
                    return branchesAPI.find(b => b.id === branch.forward)
                }).filter(Boolean);
                allBranches = [startBranch, ...fetchedRestBranches].filter(Boolean).sort((a, b) => a.id - b.id);
                setBranchPointAPI(allBranches);
                console.log(allBranches)
            } else {
                console.log('backward')
                startBranch = branchesAPI.find(branch => branch.id === selectedStartPoint.backward);
                middleBranches = sampleBranch.slice(endIndex + 1, startIndex);
                let fetchedMiddleBranches = middleBranches.map(branch => {
                    return branchesAPI.find(b => b.id === branch.backward)
                }).filter(Boolean);
                allBranches = [startBranch, ...fetchedMiddleBranches].filter(Boolean).sort((a, b) => b.id - a.id);
                setBranchPointAPI(allBranches);
                console.log(allBranches)
            }

            let firstBranchId = allBranches[0]?.id;
            let filtered = timelineDelivery.filter(timeline =>
                timeline.branchId === firstBranchId
            );
            console.log(firstBranchId)
            console.log(vehicles)
            setFilteredTimelines(filtered);
        }
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
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Box sx={{ display: 'inline-block', width: '48%', marginRight: '4%' }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="start-point-select-label">Chọn điểm bắt đầu</InputLabel>
                            <Select
                                labelId="start-point-select-label"
                                value={selectedStartPoint ? selectedStartPoint.name : ""}
                                onChange={handleStartPointChange}
                            >
                                {branches.map((branch) => (
                                    <MenuItem key={branch.id} value={branch.name}>
                                        {branch.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'inline-block', width: '48%' }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="end-point-select-label">Chọn điểm kết thúc</InputLabel>
                            <Select
                                labelId="end-point-select-label"
                                value={selectedEndPoint ? selectedEndPoint.name : ""}
                                onChange={handleEndPointChange}
                            >
                                {branches.map((branch) => (
                                    <MenuItem key={branch.id} value={branch.name}>
                                        {branch.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                {error && (
                    <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                        {error}
                    </Typography>
                )}

                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCreateTrip}>
                    Tạo chuyến
                </Button>

                <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                            {filteredTimelines && filteredTimelines.map((timeline) => (
                                <TableRow key={timeline.id}>
                                    <TableCell>{vehicles[timeline.vehicleId - 1]?.name}</TableCell>
                                    <TableCell>{formatDateTime(timeline.startDay)} - {formatDateTime(timeline.endDay)}</TableCell>
                                    <TableCell>{vehicles[timeline.vehicleId - 1]?.vehicleVolume} lít</TableCell>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                multiple
                                                value={selectedOrders[timeline.id - 1] || []}
                                                renderValue={(selected) => selected.join(', ')}
                                                onChange={(event) => handleOrderSelectChange(timeline.id, event)}
                                            >
                                                {orders.map((order) => (
                                                    <MenuItem key={order.id} value={order.id}>
                                                        <Checkbox
                                                            checked={selectedOrders[timeline.id - 1]?.includes(order.id) || false}
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