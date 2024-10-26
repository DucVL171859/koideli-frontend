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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    MenuItem,
} from "@mui/material";
import MainCard from "components/MainCard";
import orderServices from "services/orderServices";
import vehicleServices from "services/vehicleServices";
import { useParams } from "react-router-dom";
import orderDetailServices from "services/orderDetailServices";
import boxOptionServices from "services/boxOptionServices";
import deliveryServices from "services/deliveryServices";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import { toast } from "react-toastify";
import branchServices from "services/branchServices";
import orderTimelineServices from "services/orderTimelineServices";

const CreateTimeline = () => {
    const { slug } = useParams();

    const [allOrders, setAllOrders] = useState([]);
    const [allOrderDetails, setAllOrderDetails] = useState([]);

    const [packedOrders, setPackedOrders] = useState([]);
    const [selectedOrderToAdd, setSelectedOrderToAdd] = useState(null);
    const [selectedOrderDetailIds, setSelectedOrderDetailIds] = useState([]);
    const [currentOrder, setCurrentOrder] = useState({});
    const [orderDetail, setOrderDetail] = useState([]);
    const [orderDetailsMap, setOrderDetailsMap] = useState({});

    const [orderInTimeline, setOrderInTimeline] = useState([]);
    const [allInfoInOrderInTimeline, setAllInfoInOrderInTimeline] = useState({});
    const [detailIdToOrderInfoMap, setDetailIdToOrderInfoMap] = useState({});
    const [allOrderTimelines, setAllOrderTimelines] = useState([]);

    const [boxOptions, setBoxOptions] = useState([]);

    const [vehicle, setVehicle] = useState({});
    const [timelineDelivery, setTimelineDelivery] = useState({});

    const [branch, setBranch] = useState({});

    const [dialogDetailOpen, setDialogDetailOpen] = useState(false);
    const [dialogAddOpen, setDialogAddOpen] = useState(false);
    const [selectedOrderDetailId, setSelectedOrderDetailId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await getTimelineDelivery();
            await getOrder();
            await getAllOrders();
            await getAllOrderDetails();
            await getAllOrderTimelines();
        }

        fetchData();
    }, [slug]);

    useEffect(() => {
        if (timelineDelivery.vehicleId) {
            getVehicle();
        }

        if (timelineDelivery.branchId) {
            getBranch();
        }
    }, [timelineDelivery]);

    useEffect(() => {
        if (timelineDelivery.id && allOrders.length > 0 && allOrderDetails.length > 0) {
            getOrderInTimeline();
        }
    }, [timelineDelivery, allOrders, allOrderDetails]);

    const getTimelineDelivery = async () => {
        let resOfTimelineDelivery = await timelineDeliveryServices.getTimelineDeliveryById(slug);
        if (resOfTimelineDelivery.data.data) {
            setTimelineDelivery(resOfTimelineDelivery.data.data);
        }
    }

    const getOrder = async () => {
        let resOfpackedOrders = await orderServices.getOrder();
        if (resOfpackedOrders) {
            let packedOrder = resOfpackedOrders.data.data.filter(order => order.isShipping === 'Packed')
            setPackedOrders(packedOrder);
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

    const getOrderInTimeline = async () => {
        let resOfOrderInTimeline = await deliveryServices.getOrderDetailInTimeline(timelineDelivery.id);
        if (resOfOrderInTimeline.data.data) {
            setAllInfoInOrderInTimeline(resOfOrderInTimeline.data.data);
            if (resOfOrderInTimeline.data.data.orderDetails) {
                let orderDetailInTimeline = resOfOrderInTimeline.data.data.orderDetails;
                setOrderInTimeline(orderDetailInTimeline);

                let newMapping = {};
                for (let detail of orderDetailInTimeline) {
                    let matchedOrderDetail = allOrderDetails.find(orderDetail => orderDetail.id === detail.detailID);
                    if (matchedOrderDetail) {
                        let matchedOrder = allOrders.find(order => order.id === matchedOrderDetail.orderId);
                        if (matchedOrder) {
                            newMapping[detail.detailID] = {
                                orderId: matchedOrder.id,
                                boxOptionId: matchedOrderDetail.boxOptionId,
                                boxOption: {
                                    boxName: detail.boxName,
                                    volume: detail.volume
                                }
                            };
                        }
                    }
                }
                setDetailIdToOrderInfoMap(prevMap => ({
                    ...prevMap,
                    ...newMapping
                }));
            }
        }
    }

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

    const getVehicle = async () => {
        let resOfVehicles = await vehicleServices.getVehicle();
        if (resOfVehicles.data.data) {
            let listOfVehicle = resOfVehicles.data.data;
            let matchedVehicle = listOfVehicle.find(vehicle => vehicle.id === timelineDelivery.vehicleId);
            setVehicle(matchedVehicle);
        }
    }

    const getBranch = async () => {
        let resOfBranch = await branchServices.getBranch();
        if (resOfBranch.data.data) {
            let branchData = resOfBranch.data.data;
            let matchedBranch = branchData.find(branch => branch.id === timelineDelivery.branchId);
            setBranch(matchedBranch);
        }
    }

    const getAllOrders = async () => {
        let resOfOrders = await orderServices.getOrder();
        if (resOfOrders.data.data) {
            setAllOrders(resOfOrders.data.data);
        }
    }

    const getAllOrderDetails = async () => {
        let resOfOrderDetails = await orderDetailServices.getOrderDetail();
        if (resOfOrderDetails.data.data) {
            setAllOrderDetails(resOfOrderDetails.data.data);
        }
    }

    const getAllOrderTimelines = async () => {
        let resOfOrderTimeline = await orderTimelineServices.getOrderTimeline();
        if (resOfOrderTimeline.data.data) {
            setAllOrderTimelines(resOfOrderTimeline.data.data);
        }
    }

    const handledialogDetailOpen = (order) => {
        setCurrentOrder(order);
        setDialogDetailOpen(true);
    };

    const handleDialogDetailClose = () => {
        setDialogDetailOpen(false);
        setCurrentOrder(null);
    };

    const handleDialogAddOpen = () => {
        setDialogAddOpen(true);
    };

    const handleDialogAddClose = () => {
        setDialogAddOpen(false);
        setSelectedOrderDetailId(null);
    };

    const handleSelectOrderDetail = (id) => {
        setSelectedOrderDetailIds(prevIds => {
            if (prevIds.includes(id)) {
                return prevIds.filter(item => item !== id);
            } else {
                return [...prevIds, id];
            }
        });
    };

    const handleConfirmSelection = async () => {
        if (selectedOrderToAdd === null) {
            return;
        }

        let orderDetailsForSelectedOrder = allOrderDetails.filter(detail => detail.orderId === selectedOrderToAdd);
        let orderDetailIdsForSelectedOrder = orderDetailsForSelectedOrder.map(detail => detail.id);
        let orderDetailIdsInTimeline = orderInTimeline.map(timeline => timeline.detailID);
        orderDetailsForSelectedOrder = orderDetailsForSelectedOrder.filter(detail => !orderDetailIdsInTimeline.includes(detail.id));
        orderDetailIdsForSelectedOrder = orderDetailsForSelectedOrder.map(detail => detail.id);
        let allSelectedFromSameOrder = selectedOrderDetailIds.every(id => orderDetailIdsForSelectedOrder.includes(id));
        if (!allSelectedFromSameOrder) {
            return;
        }

        await Promise.all(selectedOrderDetailIds.map(async (orderDetailId) => {
            const orderTimelineCreateData = {
                orderDetailID: orderDetailId,
                timelineID: [timelineDelivery.id]
            };

            let matchedOrderDetail = Object.values(orderDetailsMap).flat().find(detail => detail.id === orderDetailId);
            let matchedOrder = matchedOrderDetail ? packedOrders.find(order => order.id === matchedOrderDetail.orderId) : null;
            if (matchedOrder) {
                let resOfAddOrderDetail = await deliveryServices.createOrderTimeline(orderTimelineCreateData);
                if (resOfAddOrderDetail.data.data) {
                    let allOrderDetailIdsInTimeline = orderDetailsForSelectedOrder.map(detail => detail.id);
                    console.log(allOrderDetailIdsInTimeline)
                    let allInTimeline = allOrderDetailIdsInTimeline.every(id => selectedOrderDetailIds.includes(id));
                    console.log(allInTimeline)
                    toast.success('Đã thêm hộp vào xe thành công');
                    if (allInTimeline) {
                        await updateOrderStatus(matchedOrder.id);
                        toast.success('Đã cập nhật trạng thái đơn hàng');
                    }
                }
            } else {
                toast.error('Thêm hộp vào xe thất bại');
            }
        }));
    };

    const updateOrderStatus = async (orderId) => {
        let matchedOrder = packedOrders.find(order => order.id === orderId);
        if (matchedOrder) {
            await orderServices.updateOrder(matchedOrder.id, {
                ...matchedOrder,
                isShipping: 'Delivering'
            });
        }
    };

    const handleDeleteOrderTimeline = async (orderTimeline) => {
        let orT = allOrderTimelines.find(orderT => orderT.orderDetailId === orderTimeline.detailID);
        if (orderTimeline.isComplete === 'Pending') {
            let resOfDelete = await orderTimelineServices.deleteOrderTimeline(orT.id);
            if (resOfDelete.data.data) {
                toast.success('Bỏ hộp khỏi xe thành công');

                let matchedOrderDetail = allOrderDetails.find(detail => detail.id === orderTimeline.detailID);
                if (matchedOrderDetail) {
                    let matchedOrder = allOrders.find(order => order.id === matchedOrderDetail.orderId);
                    if (matchedOrder) {
                        await orderServices.updateOrder(matchedOrder.id, {
                            ...matchedOrder,
                            isShipping: 'Packed'
                        });
                        toast.success(`Cập nhật trạng thái đơn hàng ${matchedOrder.id} thành công`);
                    }
                }
            } else {
                toast.error('Bỏ hộp khỏi xe thất bại')
            }
        } else {
            toast.error('Đang vận chuyển, không thể bỏ hộp khỏi xe');
        }
    }

    return (
        <Box sx={{ padding: 2 }}>
            <MainCard>
                <Typography variant="h5" fontWeight={600}>Đơn hàng chờ sắp xếp vận chuyển</Typography>
                <Box display="flex" flexWrap="wrap" justifyContent="start">
                    {packedOrders && packedOrders.map((order) => (
                        <Box key={order.id} sx={{ width: '30%', margin: '1%', border: '1px solid #ccc', borderRadius: '4px', padding: '16px' }}>
                            <Typography variant="h6">ID: {order.id}</Typography>
                            <Typography>Người nhận: {order.receiverName}</Typography>
                            <Typography>Địa chỉ nhận: {order.receiverAddress}</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handledialogDetailOpen(order)}
                                sx={{ mt: 2 }}
                            >
                                Xem Chi Tiết
                            </Button>
                        </Box>
                    ))}
                </Box>
            </MainCard >

            <Dialog open={dialogDetailOpen} onClose={handleDialogDetailClose}
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
                    <Button onClick={handleDialogDetailClose} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>

            <MainCard sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight={600}>Thông tin chuyến vận chuyển</Typography>
                {
                    vehicle ? (
                        <>
                            <Typography>Xe: {vehicle.name}</Typography>
                            <Typography>Sức chứa: {vehicle.vehicleVolume} lít</Typography>
                        </>
                    )
                        :
                        <Typography>Không tìm thấy thông tin xe</Typography>
                }
                {
                    timelineDelivery ? (
                        <>
                            <Typography>Thời gian bắt đầu: {timelineDelivery.startDay}</Typography>
                            <Typography>{`Thời gian kết thúc (dự kiến): ${timelineDelivery.endDay}`}</Typography>
                            <Typography>Chuyến: {branch.name}</Typography>
                            <Typography>Sức chứa: </Typography>
                            <Table sx={{ mt: 2, width: 'auto' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>{branch.startPoint}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Sức chứa dự kiến</TableCell>
                                        <TableCell>{allInfoInOrderInTimeline.currentVolume} / {allInfoInOrderInTimeline.maxvolume} lít</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </>
                    )
                        :
                        <Typography>Không tìm thấy thông tin chuyến</Typography>
                }

                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                    <Typography variant="h5" fontWeight={600}>Hộp trong xe</Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleDialogAddOpen}
                    >
                        Thêm hộp vào xe
                    </Button>
                </Box>

                {dialogAddOpen && (
                    <Dialog
                        open={dialogAddOpen}
                        onClose={handleDialogAddClose}
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                    >
                        <DialogTitle>Chọn hộp</DialogTitle>
                        <DialogContent>
                            <TextField
                                select
                                label="Chọn đơn hàng"
                                value={selectedOrderToAdd || ""}
                                onChange={(event) => {
                                    setSelectedOrderToAdd(event.target.value);
                                    setSelectedOrderDetailIds([]);
                                }}
                                fullWidth
                            >
                                {packedOrders.map((order) => (
                                    <MenuItem key={order.id} value={order.id}>
                                        Mã đơn hàng: {order.id}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                                {selectedOrderToAdd && orderDetailsMap[selectedOrderToAdd]?.length > 0 ? (
                                    <>
                                        {(() => {
                                            const filteredOrderDetails = orderDetailsMap[selectedOrderToAdd].filter(orderDetail =>
                                                !orderInTimeline.some(timeline => timeline.detailID === orderDetail.id)
                                            );

                                            return filteredOrderDetails.length > 0 ? (
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                <Checkbox
                                                                    onChange={(event) => {
                                                                        if (event.target.checked) {
                                                                            setSelectedOrderDetailIds(filteredOrderDetails.map(detail => detail.id));
                                                                        } else {
                                                                            setSelectedOrderDetailIds([]);
                                                                        }
                                                                    }}
                                                                    checked={
                                                                        selectedOrderDetailIds.length === filteredOrderDetails.length
                                                                    }
                                                                />
                                                            </TableCell>
                                                            <TableCell>Mã vận đơn</TableCell>
                                                            <TableCell>Đơn hàng</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {filteredOrderDetails.map(orderDetail => {
                                                            const matchedOrder = packedOrders.find(order => order.id === orderDetail.orderId);
                                                            return (
                                                                <TableRow key={orderDetail.id}>
                                                                    <TableCell>
                                                                        <Checkbox
                                                                            checked={selectedOrderDetailIds.includes(orderDetail.id)}
                                                                            onChange={() => handleSelectOrderDetail(orderDetail.id)}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>{orderDetail.id}</TableCell>
                                                                    <TableCell>{matchedOrder ? matchedOrder.id : 'N/A'}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <Typography variant="body2" sx={{ padding: 2 }}>
                                                    Tất cả các chi tiết đơn hàng đã có dữ liệu trong orderInTimeline.
                                                </Typography>
                                            );
                                        })()}
                                    </>
                                ) : (
                                    <Typography variant="body2" sx={{ padding: 2 }}>
                                        Không có dữ liệu cho đơn hàng đã chọn.
                                    </Typography>
                                )}
                            </TableContainer>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogAddClose} color="error">Đóng</Button>
                            <Button onClick={handleConfirmSelection} color="success">Xác nhận</Button>
                        </DialogActions>
                    </Dialog>
                )}

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mã đơn hàng</TableCell>
                                <TableCell>Mã vận đơn</TableCell>
                                <TableCell>Mã hộp</TableCell>
                                <TableCell>Thể tích hộp</TableCell>
                                <TableCell>Trạng Thái</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                orderInTimeline && orderInTimeline.map((orderItem) => {
                                    const orderInfo = detailIdToOrderInfoMap[orderItem.detailID];
                                    return (
                                        <TableRow key={orderItem.detailID}>
                                            <TableCell>{orderInfo ? orderInfo.orderId : 'N/A'}</TableCell>
                                            <TableCell>{orderItem.detailID}</TableCell>
                                            <TableCell>{orderInfo ? orderInfo.boxOptionId : 'N/A'}</TableCell>
                                            <TableCell>{orderInfo ? `${orderInfo.boxOption.volume} lít` : 'N/A'}</TableCell>
                                            <TableCell>{orderItem.isComplete}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDeleteOrderTimeline(orderItem)}
                                                >
                                                    Bỏ hộp khỏi xe
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
        </Box >
    );
};

export default CreateTimeline;