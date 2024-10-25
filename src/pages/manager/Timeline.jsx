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
    Button,
} from "@mui/material";
import MainCard from "components/MainCard";
import orderServices from "services/orderServices";
import orderDetailServices from "services/orderDetailServices";
import vehicleServices from "services/vehicleServices";
import boxOptionServices from "services/boxOptionServices";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import branchServices from "services/branchServices";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [orderDetailsMap, setOrderDetailsMap] = useState({});
    const [boxOptions, setBoxOptions] = useState([]);

    const [branches, setBranches] = useState([]);
    const [branchesAPI, setBranchesAPI] = useState([]);
    const [branchPointAPI, setBranchPointAPI] = useState([]);
    const [selectedStartPoint, setSelectedStartPoint] = useState(null);
    const [selectedEndPoint, setSelectedEndPoint] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState("");

    const [vehicles, setVehicles] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [timelineDelivery, setTimelineDelivery] = useState([]);
    const [filteredTimelines, setFilteredTimelines] = useState([]);
    const [existingTimelines, setExistingTimelines] = useState([]);

    const [error, setError] = useState("");

    useEffect(() => {
        const getOrders = async () => {
            let resOfOrder = await orderServices.getOrder();
            if (resOfOrder) {
                let packedOrders = resOfOrder.data.data.filter((order) => order.isShipping === 'Packed');
                setOrders(packedOrders);
                let detailsPromises = packedOrders.map(order => getOrderDetails(order.id));
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

                await Promise.all(matchedOrderDetail.map(async (orderDetail) => {
                    if (orderDetail.boxOptionId) {
                        await getBoxOptions(orderDetail.boxOptionId);
                    }
                }));
            }
        };

        const getBoxOptions = async (boxOptionId) => {
            let resOfBoxOptions = await boxOptionServices.getBoxOption();
            if (resOfBoxOptions) {
                let boxOptionsData = resOfBoxOptions.data.data;
                let matchedBoxOptions = boxOptionsData.filter(boxOption => boxOption.boxOptionId === boxOptionId);
                setBoxOptions(prevBoxOptions => [
                    ...prevBoxOptions,
                    ...matchedBoxOptions
                ]);
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
                setExistingTimelines(resOfTimelineDelivery.data.data);
            }
        }

        setBranches(sampleBranch);
        getOrders();
        getVehicles();
        getBranches();
        getTimelineDelivery();
        getBoxOptions();
    }, []);

    useEffect(() => {
        if (selectedStartPoint && selectedEndPoint && selectedStartPoint === selectedEndPoint) {
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

    const handleBranchChange = (event) => {
        const selectedBranchId = event.target.value;
        setSelectedBranch(selectedBranchId);

        const filteredTimelines = existingTimelines.filter(timeline => timeline.branchId === selectedBranchId);
        setFilteredTimelines(filteredTimelines);
    };

    const handleCreateTrip = async () => {
        if (selectedStartPoint && selectedEndPoint && selectedStartPoint !== selectedEndPoint) {
            let startIndex = sampleBranch.findIndex(branch => branch.id === selectedStartPoint.id);
            let endIndex = sampleBranch.findIndex(branch => branch.id === selectedEndPoint.id);

            let middleBranches = [];
            let allBranches = [];
            let startBranch = {};

            if (startIndex < endIndex) {
                startBranch = branchesAPI.find(branch => branch.id === selectedStartPoint.forward);
                middleBranches = sampleBranch.slice(startIndex + 1, endIndex);
                let fetchedRestBranches = middleBranches.map(branch => {
                    return branchesAPI.find(b => b.id === branch.forward)
                }).filter(Boolean);
                allBranches = [startBranch, ...fetchedRestBranches].filter(Boolean).sort((a, b) => a.id - b.id);
                setBranchPointAPI(allBranches);
            } else {
                startBranch = branchesAPI.find(branch => branch.id === selectedStartPoint.backward);
                middleBranches = sampleBranch.slice(endIndex + 1, startIndex);
                let fetchedMiddleBranches = middleBranches.map(branch => {
                    return branchesAPI.find(b => b.id === branch.backward)
                }).filter(Boolean);
                allBranches = [startBranch, ...fetchedMiddleBranches].filter(Boolean).sort((a, b) => b.id - a.id);
                setBranchPointAPI(allBranches);
            }

            let usedVehicleIds = new Set(timelineDelivery.map(timeline => timeline.vehicleId));
            let filteredVehicles = vehicles.filter(vehicle => !usedVehicleIds.has(vehicle.id));
            setAvailableVehicles(filteredVehicles);
        }
    };

    const handleSelectVehicle = (vehicleId) => {
        navigate(`/manager/create-timeline/vehicle/${vehicleId}`, { state: { branchPointAPI } });
    };

    return (
        <>
            <MainCard title="Đơn hàng chờ sắp xếp vận chuyển">
                <Box display="flex" flexWrap="wrap" justifyContent="start">
                    {orders && orders.map((order) => (
                        <Box key={order.id} sx={{ width: '30%', margin: '1%', border: '1px solid #ccc', borderRadius: '4px', padding: '16px' }}>
                            <Typography variant="h6">ID: {order.id}</Typography>
                            <Typography>Người nhận: {order.receiverName}</Typography>
                            <Typography>Địa chỉ nhận: {order.receiverAddress}</Typography>

                            <Box sx={{ marginTop: 2 }}>
                                {orderDetailsMap[order.id]?.map(orderDetail => {
                                    const matchedBoxOptions = boxOptions.filter(boxOption => boxOption.boxOptionId === orderDetail.boxOptionId);

                                    return matchedBoxOptions.map(boxOption => (
                                        <Box key={boxOption.boxOptionId} sx={{ padding: '8px', border: '1px solid #e0e0e0', margin: '4px 0' }}>
                                            <Typography>Mã hộp: {boxOption.boxOptionId}</Typography>
                                            <Typography>Tổng số cá: {boxOption.totalFish}</Typography>
                                            <Typography>Sức chứa tối đa: {boxOption.maxVolume} lít</Typography>
                                        </Box>
                                    ));
                                }) || <Typography>Không có chi tiết đơn hàng.</Typography>}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </MainCard>

            <MainCard title="Lịch trình mới" sx={{ mt: 2 }}>
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Box sx={{ display: 'inline-block', width: '40%', marginRight: '4%' }}>
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

                    <Box sx={{ display: 'inline-block', width: '40%' }}>
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
                                <TableCell>Xe có sẵn</TableCell>
                                <TableCell>Sức chứa tối đa</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {availableVehicles.map(vehicle => (
                                <TableRow key={vehicle.id}>
                                    <TableCell>{vehicle.name}</TableCell>
                                    <TableCell>{vehicle.vehicleVolume} lít</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSelectVehicle(vehicle.id)}
                                        >
                                            Chọn xe
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard >

            <MainCard title="Lịch trình đã có" sx={{ mt: 2 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="branch-select-label">Chọn Chi Nhánh</InputLabel>
                    <Select
                        labelId="branch-select-label"
                        value={selectedBranch}
                        onChange={handleBranchChange}
                    >
                        {branchesAPI.map((branch) => (
                            <MenuItem key={branch.id} value={branch.id}>
                                {branch.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Xe</TableCell>
                                <TableCell>Dự kiến bắt đầu - kết thúc</TableCell>
                                <TableCell>Sức chứa tối đa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTimelines && filteredTimelines.map((timeline) => (
                                <TableRow key={timeline.id}>
                                    <TableCell>{vehicles[timeline.vehicleId - 1]?.name}</TableCell>
                                    <TableCell>{formatDateTime(timeline.startDay)} - {formatDateTime(timeline.endDay)}</TableCell>
                                    <TableCell>{vehicles[timeline.vehicleId - 1]?.vehicleVolume} lít</TableCell>
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