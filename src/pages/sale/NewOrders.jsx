import React from 'react';
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
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';

const newOrders = [
    {
        id: 1,
        senderName: 'Alice Smith',
        senderPhone: '123-456-7890',
        receiverName: 'Bob Johnson',
        receiverPhone: '098-765-4321',
        address: '123 Pond Lane, Fishville',
        quantity: 10,
        status: 'Incomplete',
    },
    {
        id: 2,
        senderName: 'John Doe',
        senderPhone: '234-567-8901',
        receiverName: 'Jane Doe',
        receiverPhone: '345-678-9012',
        address: '456 Waterway Ave, Aquatown',
        quantity: 5,
        status: 'Incomplete',
    },
];

const ordersInProcess = [
    {
        id: 1,
        senderName: 'Le Duc',
        senderPhone: '123-456-7890',
        receiverName: 'Hoang Anh',
        receiverPhone: '098-765-4321',
        address: 'Nha van hoa sinh vien, Binh Duong',
        quantity: 7,
        status: 'Accepted',
    },
    {
        id: 2,
        senderName: 'Quang Bui',
        senderPhone: '234-567-8901',
        receiverName: 'Son',
        receiverPhone: '345-678-9012',
        address: 'Vinhome GrandPark Quan 9',
        quantity: 3,
        status: 'Received',
    },
];

const NewOrders = () => {
    const navigate = useNavigate();
    const handleExecuteOrder = () => {
        navigate('/sale/order-checking');
    };

    const handleUpdateOrder = () => {
        navigate('/sale/order-update');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Incomplete':
                return '#00d8ff';
            case 'Accepted':
                return '#bfbf2d';
            case 'Received':
                return '#5ccb26';
            default:
                return 'gray';
        }
    };

    return (
        <>
            <MainCard title="Đơn hàng mới">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#272242' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Người gửi</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Người nhận</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Địa chỉ người nhận</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Số lượng cá</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Trạng thái</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {newOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{`${order.senderName} / ${order.senderPhone}`}</TableCell>
                                    <TableCell>{`${order.receiverName} / ${order.receiverPhone}`}</TableCell>
                                    <TableCell>{order.address}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Box
                                                sx={{
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    bgcolor: getStatusColor(order.status),
                                                    marginRight: '8px',
                                                }}
                                            />
                                            {order.status}
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
            <MainCard title="Đơn hàng đang xử lý" sx={{ marginTop: '20px' }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#272242' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Người gửi</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Người nhận</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Địa chỉ người nhận</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Số lượng cá</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Trạng thái</TableCell>
                                <TableCell sx={{ color: '#FFF', fontWeight: 600 }}>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordersInProcess.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{`${order.senderName} / ${order.senderPhone}`}</TableCell>
                                    <TableCell>{`${order.receiverName} / ${order.receiverPhone}`}</TableCell>
                                    <TableCell>{order.address}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <Box
                                                sx={{
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    bgcolor: getStatusColor(order.status),
                                                    marginRight: '8px',
                                                }}
                                            />
                                            {order.status}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleUpdateOrder(order.id)}
                                            sx={{ bgcolor: '#272242', color: '#FFF' }}
                                        >
                                            Cập nhật
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