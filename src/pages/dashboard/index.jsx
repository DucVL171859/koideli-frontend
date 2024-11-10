import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import AnalyticEcommerce from "../../components/dashboard/figure-cards/AnalyticEcommerce";
import MainCard from "../../components/MainCard";
import { useEffect, useState } from "react";
import orderServices from "services/orderServices";
import userServices from "services/userServices";
import boxOptionServices from "services/boxOptionServices";
import timelineDeliveryServices from "services/timelineDeliveryServices";

const statusColors = {
    Pending: '#e69b4b',
    Approved: '#4186f9',
    Packed: '#ab935e',
    Delivering: '#4a89d7',
    Completed: '#79ff00',
    Cancelled: '#ff072e',
};

const statusMessages = {
    Pending: 'Đơn hàng mới',
    Approved: 'Đã xác nhận',
    Packed: 'Chờ sắp xếp chuyến',
    Delivering: 'Đang vận chuyển',
    Completed: 'Đã giao thành công',
    Cancelled: 'Giao không thành công',
};

export default function DashboardDefault() {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [boxOptions, setBoxOptions] = useState([]);
    const [timelines, setTimelines] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            getOrder();
            getUser();
            getBoxOption();
            getTimeline();
        }

        fetchData();
    }, []);

    const getOrder = async () => {
        let resOfOrder = await orderServices.getOrder();
        if (resOfOrder.data.data) {
            setOrders(resOfOrder.data.data);
        }
    }

    const getUser = async () => {
        let resOfUser = await userServices.getAllUser();
        if (resOfUser.data.data) {
            setUsers(resOfUser.data.data);
        }
    }

    const getBoxOption = async () => {
        let resOfBoxOption = await boxOptionServices.getBoxOption();
        if (resOfBoxOption.data.data) {
            setBoxOptions(resOfBoxOption.data.data);
        }
    }

    const getTimeline = async () => {
        let resOfTimeline = await timelineDeliveryServices.getTimelineDelivery();
        if (resOfTimeline.data.data) {
            setTimelines(resOfTimeline.data.data);
        }
    }

    const getStatusColor = (status) => {
        return statusColors[status] || 'gray';
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Dashboard</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Số lượng đơn hàng" count={orders.length} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Số lượng người dùng" count={users.length} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Số lượng hộp cá đã dùng" count={boxOptions.length} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Số lượng chuyến vận chuyển" count={timelines.length} />
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Danh sách đơn hàng</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#272242' }}>
                                <TableRow>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Người gửi</TableCell>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Địa chỉ người gửi</TableCell>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Người nhận</TableCell>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Địa chỉ người nhận</TableCell>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Tổng tiền</TableCell>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Trạng thái</TableCell>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Thanh toán</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.senderName}</TableCell>
                                        <TableCell>{order.senderAddress}</TableCell>
                                        <TableCell>{`${order.receiverName} / ${order.receiverPhone}`}</TableCell>
                                        <TableCell>{order.receiverAddress}</TableCell>
                                        <TableCell sx={{ justifyItems: 'flex-end' }}>{order.totalFee.toLocaleString()} VND</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Box
                                                    sx={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        bgcolor: getStatusColor(order.isShipping),
                                                        marginRight: '8px',
                                                    }}
                                                />
                                                {statusMessages[order.isShipping]}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {order.isPayment ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </MainCard>
            </Grid>
        </Grid>
    )
}