import React from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Divider,
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate } from 'react-router-dom';

const OrderDetail = () => {
    const navigate = useNavigate();
    const order = {
        status: 'Incomplete',
        sender: {
            name: 'Alice Smith',
            phone: '123-456-7890',
            address: '123 Pond Lane, Fishville',
            createdDate: '2023-09-25 14:30',
        },
        receiver: {
            name: 'Bob Johnson',
            phone: '098-765-4321',
            address: '456 Waterway Ave, Aquatown',
        },
        koiFish: {
            totalQuantity: 10,
            sizeDistribution: {
                '<19cm': 3,
                '20-25cm': 4,
                '26-30cm': 3,
            },
            pictures: [
                '/path/to/picture1.jpg',
                '/path/to/picture2.jpg',
                '/path/to/picture3.jpg',
                '/path/to/picture4.jpg',
            ],
        },
        note: 'Please handle with care!',
        deliveryInfo: {
            isIncomplete: true,
            staffList: ['Staff A', 'Staff B', 'Staff C'],
        },
        fee: {
            estimate: '$50',
        },
    };

    const handleAcceptOrder = () => {
        navigate('/sale/new-orders');
    };

    const handleRejectOrder = () => {
        console.log("Order rejected");
    };

    return (
        <MainCard>
            <Typography variant="h4" align="left" gutterBottom>
                Order Status: {order.status}
            </Typography>
            <Typography>Created Order Date & Time: {order.sender.createdDate}</Typography>

            <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
                <Typography variant="h6">Sender & Receiver Information</Typography>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1">Sender:</Typography>
                        <Typography>{order.sender.name} / {order.sender.phone}</Typography>
                        <Typography>{order.sender.address}</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem sx={{ marginX: 2 }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1">Receiver:</Typography>
                        <Typography>{order.receiver.name} / {order.receiver.phone}</Typography>
                        <Typography>{order.receiver.address}</Typography>
                    </Box>
                </Box>
            </Paper>

            <Divider sx={{ marginBottom: 2 }} />

            <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
                <Typography variant="h6">Koi Fish Information</Typography>
                <Typography>Total Quantity of Koi Fish: {order.koiFish.totalQuantity}</Typography>
                <Box display="flex" justifyContent="space-between" marginTop={2}>
                    {Object.entries(order.koiFish.sizeDistribution).map(([size, quantity]) => (
                        <Paper key={size} sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'center' }}>
                            <Typography variant="subtitle1">{size}</Typography>
                            <Typography variant="h5">{quantity}</Typography>
                        </Paper>
                    ))}
                </Box>
                <Box display="flex" justifyContent="space-around" marginTop={2}>
                    {order.koiFish.pictures.map((pic, index) => (
                        <Paper key={index} sx={{ width: '100px', height: '100px', padding: 1, textAlign: 'center' }}>
                            <img src={pic} alt={`Koi Fish ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                        </Paper>
                    ))}
                </Box>
            </Paper>

            <Divider sx={{ marginBottom: 2 }} />

            <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
                <Typography variant="h6">Note from Customer</Typography>
                <Typography>{order.note}</Typography>
            </Paper>

            <Divider sx={{ marginBottom: 2 }} />

            <Paper sx={{ padding: 2, boxShadow: 0 }}>
                <Typography variant="h6">Fee Information</Typography>
                {order.deliveryInfo.isIncomplete ? (
                    <Typography>Estimated Fee: {order.fee.estimate}</Typography>
                ) : (
                    <Typography>Fee information is not available.</Typography>
                )}
            </Paper>

            <Box display="flex" justifyContent="center" marginTop={2}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleRejectOrder}
                    sx={{ marginRight: 4 }}
                >
                    Reject
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleAcceptOrder}
                >
                    Accept
                </Button>
            </Box>
        </MainCard>
    );
};

export default OrderDetail;