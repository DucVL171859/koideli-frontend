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

const NewOrders = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Approved');

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
        navigate(`/manager/order-checking/${slug}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return '#f0ad4e';
            case 'Approved':
                return '#5cb85c';
            case 'Rejected':
                return '#d9534f';
            case 'Cancelled':
                return '#d9534f';
            case 'Packing':
                return '#5bc0de';
            case 'Completed':
                return '#5bc0de';
            default:
                return 'gray';
        }
    };

    const handleFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const filteredOrders = order.filter((o) => {
        return statusFilter === 'All' || o.isShipping === statusFilter;
    });

    return (
        <>
            <FormControl variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                    value={statusFilter}
                    onChange={handleFilterChange}
                    label="Status"
                >
                    <MenuItem value="All">Tất cả đơn hàng</MenuItem>
                    <MenuItem value="Pending">Đơn hàng mới</MenuItem>
                    <MenuItem value="Approved">Đơn hàng đã xác nhận</MenuItem>
                    <MenuItem value="Rejected">Đơn hàng đã từ chối</MenuItem>
                    <MenuItem value="Delivering">Đơn hàng đang vận chuyển</MenuItem>
                    <MenuItem value="Completed">Đơn hàng đã vận chuyển</MenuItem>
                </Select>
            </FormControl>

            <MainCard title="Đơn hàng mới">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#272242' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Người nhận</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Địa chỉ người nhận</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Số lượng cá</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Trạng thái</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{`${order.receiverName} / ${order.receiverPhone}`}</TableCell>
                                    <TableCell>{order.receiverAddress}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
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
                                            {order.isShipping}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleExecuteOrder(order.id)}
                                            sx={{ bgcolor: '#272242', color: '#FFF' }}
                                        >
                                            Xử lý
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

export default NewOrders;