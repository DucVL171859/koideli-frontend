import React, { useEffect, useState } from "react";
import {
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
} from "@mui/material";
import MainCard from "components/MainCard";
import orderServices from "services/orderServices";
import vehicleServices from "services/vehicleServices";
import { useLocation, useParams } from "react-router-dom";
import orderDetailServices from "services/orderDetailServices";
import boxOptionServices from "services/boxOptionServices";
import deliveryServices from "services/deliveryServices";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import { toast } from "react-toastify";

const CreateTimeline = () => {
    const { slug } = useParams();
    const location = useLocation();
    const allBranchesAPI = location.state?.branchPointAPI || [];

    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState({});
    const [orderDetail, setOrderDetail] = useState([]);
    const [orderDetailsMap, setOrderDetailsMap] = useState({});

    const [boxOptions, setBoxOptions] = useState([]);

    const [vehicle, setVehicle] = useState({});
    const [estimatedVolumes, setEstimatedVolumes] = useState({});

    const [totalStartTime, setTotalStartTime] = useState("");
    const [totalVolume, setTotalVolume] = useState(0);

    const [branchVolumes, setBranchVolumes] = useState({
        CT: 0,
        HCM: 0,
        DN: 0,
        HP: 0,
        HN: 0,
    });

    useEffect(() => {
        const getVehicleById = async () => {
            let resOfVehicle = await vehicleServices.getVehicleById(slug);
            if (resOfVehicle) {
                setVehicle(resOfVehicle.data.data);
            }
        }

        const getOrder = async () => {
            let resOfOrders = await orderServices.getOrder();
            if (resOfOrders) {
                let packedOrder = resOfOrders.data.data.filter(order => order.isShipping === 'Packed')
                setOrders(packedOrder);
                let detailsPromises = packedOrder.map(order => getOrderDetails(order.id));
                await Promise.all(detailsPromises);
            }
        };

        const getOrderDetails = async (orderId) => {
            let resOfOrderDetail = await orderDetailServices.getOrderDetail();
            if (resOfOrderDetail) {
                let orderDetailData = resOfOrderDetail.data.data;
                let matchedOrderDetail = orderDetailData.filter(detail => detail.orderId === orderId);
                setOrderDetail(matchedOrderDetail);
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

        getVehicleById();
        getOrder();
    }, [slug]);

    useEffect(() => {
        const newVolumes = {
            CT: 0,
            HCM: 0,
            DN: 0,
            HP: 0,
            HN: 0,
        };

        for (const [id, volume] of Object.entries(estimatedVolumes)) {
            allBranchesAPI.forEach(branch => {
                switch (branch.id) {
                    case 1:
                        newVolumes.CT = volume;
                        break;
                    case 2:
                        newVolumes.HCM = volume;
                        break;
                    case 3:
                        newVolumes.HCM = volume;
                        break;
                    case 4:
                        newVolumes.DN = volume;
                        break;
                    case 5:
                        newVolumes.DN = volume;
                        break;
                    case 6:
                        newVolumes.HP = volume;
                        break;
                    case 7:
                        newVolumes.HP = volume;
                        break;
                    case 8:
                        newVolumes.HN = volume;
                        break;
                }
            });
        }

        setBranchVolumes(newVolumes);
    }, [estimatedVolumes]);

    const createTimeline = async (timelineInfo) => {
        // try {
        let resOfCreateTimeline = await deliveryServices.createTimeline(timelineInfo);
        if (resOfCreateTimeline) {
            console.log(resOfCreateTimeline)
            let resOfTimelineDelivery = await timelineDeliveryServices.getTimelineDeliveryEnable();
            if (resOfTimelineDelivery) {
                console.log(resOfTimelineDelivery)
                let timelineData = resOfTimelineDelivery.data.data;
                let matchedTimeline = timelineData.filter(timeline => timeline.vehicleId == slug);
                let timelineID = matchedTimeline.map(timeline => timeline.id);

                if (timelineID) {
                    for (const detail of orderDetail) {
                        const orderTimelineInfo = {
                            orderDetailID: detail.id,
                            timelineID: timelineID,
                        };

                        let resOfCreateOrderTimeline = await createOrderTimeline(orderTimelineInfo);
                        if (resOfCreateOrderTimeline.data.data) {
                            console.log(resOfCreateOrderTimeline)
                            toast.success('Thêm đơn hàng vào xe thành công');
                        } else {
                            toast.error('Thêm đơn hàng không thành công');
                        }
                    }

                    await Promise.all(timelineID.map(async (id) => {
                        let resOfOrderInTimeline = await deliveryServices.getOrderDetailInTimeline(id);
                        if (resOfOrderInTimeline.data.data) {
                            console.log(resOfOrderInTimeline)
                            let maxVolume = resOfOrderInTimeline.data.data.maxvolume;
                            let remainingVolume = resOfOrderInTimeline.data.data.remainingVolume;
                            let estimatedVolume = maxVolume - remainingVolume;

                            setEstimatedVolumes(prev => ({
                                ...prev,
                                [id]: estimatedVolume
                            }));

                            let totalEstimatedVolume = Object.values({
                                ...estimatedVolumes,
                                [id]: estimatedVolume
                            }).reduce((acc, volume) => acc + volume, 0);
                            setTotalVolume(totalEstimatedVolume);
                        }
                    }));
                }
            }
        }
        // } 
        // catch (error) {
        //     console.log(error)
        //     toast.error('Thêm đơn hàng không thành công');
        // }
    }

    const createOrderTimeline = async (orderTimelineInfo) => {
        return await deliveryServices.createOrderTimeline(orderTimelineInfo);
    }

    const handleDateChange = (event) => {
        const dateValue = event.target.value;
        const dateTime = new Date(dateValue).toISOString();
        setTotalStartTime(dateTime);
    };

    const handleAddOrderToVehicle = (orderId, vehicleId) => {
        setSelectedOrders(prev => ({
            ...prev,
            [vehicleId]: [...(prev[vehicleId] || []), orderId],
        }));

        const de_CreateDetailTimelineDTOs = allBranchesAPI.map(branch => ({
            branchId: branch.id,
        }));

        const timelineInfoForCreation = {
            vehicleId: slug,
            totalStartTime: totalStartTime,
            de_CreateDetailTimelineDTOs: de_CreateDetailTimelineDTOs
        };
        createTimeline(timelineInfoForCreation);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <MainCard title="Thông tin xe">
                <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="h6">Xe: {vehicle.name}</Typography>
                    <Typography>Sức chứa tối đa: {vehicle.vehicleVolume} lít</Typography>
                </Box>
            </MainCard>

            <MainCard title="Tạo mới lịch trình" sx={{ mt: 2 }}>
                <Box>
                    <Typography>Chọn thời gian khởi hành: </Typography>
                    <TextField
                        type="datetime-local"
                        onChange={handleDateChange}
                        sx={{ marginTop: 2 }}
                    />
                </Box>
                <Box display="flex" flexWrap="wrap" justifyContent="space-between">
                    {orders.map(order => (
                        <Box key={order.id} sx={{ border: '1px solid #ccc', margin: '1%', padding: 2, width: '30%' }}>
                            <Typography variant="h6">Order ID: {order.id}</Typography>
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
                            <Button
                                key={vehicle.id}
                                variant="contained"
                                color="primary"
                                onClick={() => handleAddOrderToVehicle(order.id, vehicle.id)}
                                sx={{ marginTop: 1 }}
                            >
                                Thêm vào xe
                            </Button>
                        </Box>
                    ))}
                </Box>

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Thể tích tổng hộp/Sức chứa tối đa</TableCell>
                                <TableCell>Sức chứa tại CT</TableCell>
                                <TableCell>Sức chứa tại HCM</TableCell>
                                <TableCell>Sức chứa tại ĐN</TableCell>
                                <TableCell>Sức chứa tại HP</TableCell>
                                <TableCell>Sức chứa tại HN</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={vehicle.id}>
                                <TableCell>
                                    {totalVolume} / {vehicle.vehicleVolume} lít
                                </TableCell>
                                <TableCell>
                                    {branchVolumes.CT !== 0 ? `${branchVolumes.CT} / ${vehicle.vehicleVolume} lít` : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {branchVolumes.HCM !== 0 ? `${branchVolumes.HCM} / ${vehicle.vehicleVolume} lít` : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {branchVolumes.DN !== 0 ? `${branchVolumes.DN} / ${vehicle.vehicleVolume} lít` : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {branchVolumes.HP !== 0 ? `${branchVolumes.HP} / ${vehicle.vehicleVolume} lít` : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {branchVolumes.HN !== 0 ? `${branchVolumes.HN} / ${vehicle.vehicleVolume} lít` : 'N/A'}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
        </Box>
    );
};

export default CreateTimeline;