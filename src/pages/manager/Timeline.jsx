import React, { useEffect, useState } from "react";
import {
    Typography,
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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Radio,
    Grid,
} from "@mui/material";
import MainCard from "components/MainCard";
import orderServices from "services/orderServices";
import orderDetailServices from "services/orderDetailServices";
import vehicleServices from "services/vehicleServices";
import boxOptionServices from "services/boxOptionServices";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import branchServices from "services/branchServices";
import { toast } from "react-toastify";
import deliveryServices from "services/deliveryServices";
import ExistingTimelines from "./ExistingTimeline";
import AllTimeline from "./AllTimeline";

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
    const [currentOrder, setCurrentOrder] = useState({});
    const [orderDetailsMap, setOrderDetailsMap] = useState({});
    const [boxOptions, setBoxOptions] = useState([]);

    const [branches, setBranches] = useState([]);
    const [branchesAPI, setBranchesAPI] = useState([]);
    const [branchPointAPI, setBranchPointAPI] = useState([]);
    const [selectedStartPoint, setSelectedStartPoint] = useState(null);
    const [selectedEndPoint, setSelectedEndPoint] = useState(null);

    const [vehicles, setVehicles] = useState([]);
    const [timelineDelivery, setTimelineDelivery] = useState([]);

    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const [totalStartTime, setTotalStartTime] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            await getOrders();
            await getVehicles();
            await getBranches();
            await getTimelineDelivery();
            await getBoxOptions();
        }

        setBranches(sampleBranch);
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedStartPoint && selectedEndPoint && selectedStartPoint === selectedEndPoint) {
            setError("Điểm bắt đầu và điểm kết thúc không thể giống nhau.");
        } else {
            setError("");
        }
    }, [selectedStartPoint, selectedEndPoint]);

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
        let resOfTimelineDelivery = await timelineDeliveryServices.getTimelineDeliveryEnable();
        if (resOfTimelineDelivery) {
            setTimelineDelivery(resOfTimelineDelivery.data.data);
        }
    }

    const handleStartPointChange = (event) => {
        let selStartPoint = sampleBranch.find(branch => branch.name === event.target.value);
        setSelectedStartPoint(selStartPoint);
    };

    const handleEndPointChange = (event) => {
        let selEndPoint = sampleBranch.find(branch => branch.name === event.target.value);
        setSelectedEndPoint(selEndPoint);
    };

    const getBranchGoneThrow = () => {
        let startIndex = sampleBranch.findIndex(branch => branch.id === selectedStartPoint.id);
        let endIndex = sampleBranch.findIndex(branch => branch.id === selectedEndPoint.id);

        let middleBranches = [];
        let allBranches = [];
        let startBranch = {};

        if (startIndex < endIndex) {
            startBranch = branchesAPI.find(branch => branch.id === selectedStartPoint.forward);
            middleBranches = sampleBranch.slice(startIndex + 1, endIndex);
            let fetchedRestBranches = middleBranches.map(branch => {
                return branchesAPI.find(b => b.id === branch.forward);
            }).filter(Boolean);
            allBranches = [startBranch, ...fetchedRestBranches].filter(Boolean).sort((a, b) => a.id - b.id);
            setBranchPointAPI(allBranches);
            console.log(allBranches)
        } else {
            startBranch = branchesAPI.find(branch => branch.id === selectedStartPoint.backward);
            middleBranches = sampleBranch.slice(endIndex + 1, startIndex);
            let fetchedMiddleBranches = middleBranches.map(branch => {
                return branchesAPI.find(b => b.id === branch.backward);
            }).filter(Boolean);
            allBranches = [startBranch, ...fetchedMiddleBranches].filter(Boolean).sort((a, b) => b.id - a.id);
            setBranchPointAPI(allBranches);
        }

        return allBranches;
    }

    const handleCreateTrip = async () => {
        let allBranchGoneThrow = getBranchGoneThrow();
        let de_CreateDetailTimelineDTOs = allBranchGoneThrow.map(branch => ({
            branchId: branch.id,
        }));
        const timelineInfo = {
            vehicleId: selectedVehicle,
            totalStartTime: totalStartTime,
            de_CreateDetailTimelineDTOs: de_CreateDetailTimelineDTOs
        };
        try {
            let resOfCreateTimeline = await deliveryServices.createTimeline(timelineInfo);
            if (resOfCreateTimeline.data.data) {
                setConfirmDialogOpen(false);
                setSelectedStartPoint(null);
                setSelectedEndPoint(null);
                setTotalStartTime("");
                setSelectedVehicle("");
                toast.success('Tạo lịch trình thành công');
            } else {
                toast.error('Tạo lịch trình thất bại');
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleSelectVehicle = (event) => {
        setSelectedVehicle(Number(event.target.value));
    };

    const handleOpenConfirmDialog = () => {
        if (
            selectedStartPoint &&
            selectedEndPoint &&
            selectedStartPoint !== selectedEndPoint &&
            totalStartTime &&
            selectedVehicle
        ) {
            setConfirmDialogOpen(true);
        } else {
            toast.error('Vui lòng chọn đủ địa điểm, thời gian và xe để tạo chuyến');
        }
    };

    const handleDateChange = (event) => {
        const dateValue = event.target.value;
        const dateTime = new Date(dateValue).toISOString();
        setTotalStartTime(dateTime);
    };

    const handleDialogOpen = (order) => {
        setCurrentOrder(order);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentOrder(null);
    };

    return (
        <>
            <MainCard>
                <Typography variant="h5" fontWeight={600}>Đơn hàng chờ sắp xếp vận chuyển</Typography>
                <Box display="flex" flexWrap="wrap" justifyContent="start">
                    {orders && orders.map((order) => (
                        <Box key={order.id} sx={{ width: '25%', margin: '1%', border: '1px solid #ccc', borderRadius: '4px', padding: '16px' }}>
                            <Typography variant="h6">ID: {order.id}</Typography>
                            <Typography>Người nhận: {order.receiverName}</Typography>
                            <Typography>Địa chỉ nhận: {order.receiverAddress}</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleDialogOpen(order)}
                                sx={{ mt: 2 }}
                            >
                                Xem Chi Tiết
                            </Button>
                        </Box>
                    ))}
                </Box>
            </MainCard>

            <Dialog open={dialogOpen} onClose={handleDialogClose}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    style: {
                        width: '1200px',
                        maxWidth: '100%',
                        margin: 'auto',
                    },
                }}
            >
                <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {currentOrder && (
                        <Box sx={{ padding: '16px', borderRadius: '4px' }}>
                            <Typography variant="h6">ID: {currentOrder.id}</Typography>
                            <Typography>Người nhận: {currentOrder.receiverName}</Typography>
                            <Typography>Địa chỉ nhận: {currentOrder.receiverAddress}</Typography>
                            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                                {orderDetailsMap[currentOrder.id]?.map(orderDetail => {
                                    const matchedBoxOptions = boxOptions.filter(boxOption => boxOption.boxOptionId === orderDetail.boxOptionId);

                                    return matchedBoxOptions.map(boxOption => (
                                        <Grid item xs={3} key={boxOption.boxOptionId}>
                                            <Box sx={{ padding: '8px', border: '1px solid #000', margin: '4px 0', bgcolor: '#a38d69' }}>
                                                <Typography sx={{ color: '#fff' }}>Mã vận đơn: {orderDetail.id}</Typography>
                                                <Typography sx={{ color: '#fff' }}>Loại hộp: {boxOption.boxName}</Typography>
                                                <Typography sx={{ color: '#fff' }}>Mã hộp: {boxOption.boxOptionId}</Typography>
                                                <Typography sx={{ color: '#fff' }}>Tổng số cá: {boxOption.totalFish}</Typography>
                                                <Typography sx={{ color: '#fff' }}>Sức chứa tối đa: {boxOption.maxVolume} lít</Typography>
                                            </Box>
                                        </Grid>
                                    ));
                                }) || <Typography>Không có chi tiết đơn hàng.</Typography>}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>

            <MainCard sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight={600}>Tất cả lịch trình</Typography>
                <AllTimeline />
            </MainCard>

            <MainCard sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight={600}>Tìm lịch trình phù hợp</Typography>
                <ExistingTimelines />
            </MainCard>

            <MainCard sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight={600}>Tạo lịch trình mới</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ width: '45%' }}>
                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                            <Box sx={{ width: '100%', marginBottom: 2 }}>
                                <Typography>Chọn địa điểm: </Typography>
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
                            <Box sx={{ width: '100%' }}>
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
                    </Box>
                    <Box sx={{ width: '45%', marginLeft: '4%' }}>
                        <Typography>Chọn thời gian khởi hành: </Typography>
                        <TextField
                            type="datetime-local"
                            onChange={handleDateChange}
                            sx={{ marginTop: 2, width: '100%' }}
                        />
                    </Box>
                </Box>

                {error && (
                    <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Chọn xe:</Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}></TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Tên xe</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#272242', color: '#fff' }}>Sức chứa tối đa</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vehicles && vehicles.map(vehicle => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell>
                                            <Radio
                                                value={vehicle.id}
                                                checked={selectedVehicle === vehicle.id}
                                                onChange={handleSelectVehicle}
                                            />
                                        </TableCell>
                                        <TableCell>{vehicle.name}</TableCell>
                                        <TableCell>{vehicle.vehicleVolume} lít</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={2}
                >
                    <Button variant="contained" color="success" onClick={handleOpenConfirmDialog}>
                        Tạo chuyến
                    </Button>
                </Box>
            </MainCard >

            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Xác nhận tạo chuyến</DialogTitle>
                <DialogContent>
                    <Typography>Bạn chắc chắn muốn tạo chuyến:</Typography>
                    <Typography>- Xe: {vehicles.find(vehicle => vehicle.id === selectedVehicle)
                        ? vehicles.find(vehicle => vehicle.id === selectedVehicle).name
                        : null}
                    </Typography>
                    <Typography>- Thời gian khởi hành: {formatDateTime(totalStartTime)}</Typography>
                    <Typography>- Địa điểm: {selectedStartPoint?.name} - {selectedEndPoint?.name}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleCreateTrip} color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Timeline;