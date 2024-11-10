import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';
import orderServices from 'services/orderServices';
import boxOptionServices from 'services/boxOptionServices';

const Order = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [paymentFilter, setPaymentFilter] = useState('All');

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
            let resOfOrder = await orderServices.getOrder();
            if (resOfOrder) {
                let orderData = resOfOrder.data.data;
                setOrder(orderData);
            }
        };

        const getKoiFish = async () => {
            await boxOptionServices.getBoxOption();
        };

        getOrder();
        getKoiFish();
    }, []);

    const handleExecuteOrder = (slug) => {
        navigate(`/sale/order-checking/${slug}`);
    };

    const handleUpdateOrder = (slug) => {
        navigate(`/sale/order-update/${slug}`);
    };

    const handleViewDetails = (slug) => {
        navigate(`/sale/order-detail/${slug}`);
    };

    const getStatusColor = (status) => {
        return statusColors[status] || 'gray';
    };

    const filteredOrders = order.filter((o) => {
        let isStatusMatch = statusFilter === 'All' || o.isShipping === statusFilter;
        let isPaymentMatch = paymentFilter === 'All' || (paymentFilter === 'Paid' ? o.isPayment : !o.isPayment);
        return isStatusMatch && isPaymentMatch;
    });

    return (
        <>
            <FormControl variant="outlined" sx={{ mb: 2, mr: 2 }}>
                <InputLabel>Trạng thái đơn hàng</InputLabel>
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Trạng thái đơn hàng"
                >
                    <MenuItem value="All">Tất cả đơn hàng</MenuItem>
                    <MenuItem value="Pending">Đơn hàng mới</MenuItem>
                    <MenuItem value="Approved">Đã xác nhận</MenuItem>
                    <MenuItem value="Packed">Chờ sắp xếp chuyến</MenuItem>
                    <MenuItem value="Delivering">Đang vận chuyển</MenuItem>
                    <MenuItem value="Completed">Đã giao thành công</MenuItem>
                    <MenuItem value="Cancelled">Giao không thành công</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Thanh toán</InputLabel>
                <Select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    label="Thanh toán"
                >
                    <MenuItem value="All">Tất cả</MenuItem>
                    <MenuItem value="Paid">Đã thanh toán</MenuItem>
                    <MenuItem value="Unpaid">Chưa thanh toán</MenuItem>
                </Select>
            </FormControl>

            <MainCard title="Đơn hàng mới">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#272242' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Người nhận</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Địa chỉ người nhận</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Trạng thái</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Thanh toán</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{`${order.receiverName} / ${order.receiverPhone}`}</TableCell>
                                    <TableCell>{order.receiverAddress}</TableCell>
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
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                if (order.isShipping === 'Pending') {
                                                    handleExecuteOrder(order.id);
                                                } else if (order.isShipping === 'Approved') {
                                                    handleUpdateOrder(order.id);
                                                } else {
                                                    handleViewDetails(order.id);
                                                }
                                            }}
                                            sx={{ bgcolor: '#272242', color: '#FFF' }}
                                        >
                                            {order.isShipping === 'Pending' ? 'Xử lý' :
                                                order.isShipping === 'Approved' ? 'Cập nhật' : 'Xem chi tiết'}
                                        </Button>
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

export default Order;