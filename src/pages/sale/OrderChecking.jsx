import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Divider,
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useNavigate, useParams } from 'react-router-dom';
import orderServices from 'services/orderServices';
import koiFishServices from 'services/koiFishServices';
import orderDetailServices from 'services/orderDetailServices';
import boxOptionServices from 'services/boxOptionServices';

const OrderDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});
    const [orderDetail, setOrderDetail] = useState([]);
    const [currentOrderDetail, setCurrentOrderDetail] = useState([]);
    const [boxOption, setBoxOption] = useState([]);
    const [koiFist, setKoiFist] = useState([]);

    useEffect(() => {
        const getOrder = async () => {
            let resOfOrder = await orderServices.getOrderById(slug);
            if (resOfOrder) {
                let orderData = resOfOrder.data.data;
                setOrder(orderData);
                getOrderDetail(orderData.id);
            }
        };

        const getOrderDetail = async (orderId) => {
            let resOfOrderDetail = await orderDetailServices.getOrderDetail();
            if (resOfOrderDetail) {
                let orderDetailData = resOfOrderDetail.data.data;
                setOrderDetail(orderDetailData);

                let matchedOrderDetail = orderDetailData.filter(detail => detail.orderId === orderId)
                setCurrentOrderDetail(matchedOrderDetail);
                matchedOrderDetail.forEach(detail => {
                    getBoxOptionById(detail.boxOptionId);
                })
            }
        }

        const getBoxOptionById = async (boxOptionId) => {
            let resOfBoxOption = await boxOptionServices.getBoxOptionById(boxOptionId);
            if (resOfBoxOption) {
                setBoxOption(prevOptions => [...prevOptions, resOfBoxOption.data.data]);
                console.log(resOfBoxOption.data.data)
                getKoiFish(resOfBoxOption.data.data.fishId);
            }
        }

        const getKoiFish = async (fishId) => {
            let resOfKoiFish = await koiFishServices.getKoiFishById(fishId);
            if (resOfKoiFish) {
                setKoiFist(prevKoiFish => [...prevKoiFish, resOfKoiFish.data.data]);
                console.log(resOfKoiFish.data.data);
            }
        }

        getOrder();
        getOrderDetail();
    }, [slug]);

    const filteredKoi = koiFist.filter(koi =>
        boxOption.some(option => option.fishId === koi.id)
    );

    const totalQuantity = boxOption.reduce((total, option) => {
        const koi = koiFist.find(koi => koi.id === option.fishId);
        return koi ? total + option.quantity : total;
    }, 0);

    const handleAcceptOrder = async (id) => {
        let updatedData = {
            isShipping: 'Approved'
        };
        await orderServices.updateOrder(id, updatedData);
        navigate('/sale/order');
    };

    const handleRejectOrder = () => {
        console.log("Order rejected");
    };

    return (
        <MainCard>
            <Typography variant="h4" align="left" gutterBottom>
                Trạng thái đơn hàng: {order.isShipping}
            </Typography>

            <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
                <Typography variant="h6">Thông tin gửi nhận</Typography>
                <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'start' }}>
                    <Typography variant="subtitle1">Người nhận: {order.receiverName} / {order.receiverPhone}</Typography>
                    <Typography variant="subtitle1">Địa chỉ nhận: {order.receiverAddress}</Typography>
                </Paper>
            </Paper>

            <Divider sx={{ marginBottom: 2 }} />

            <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
                <Typography variant="h6">Thông tin cá Koi</Typography>
                <Typography>Tổng số lượng cá: {totalQuantity}</Typography>
                <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'start' }}>
                    <Box display="flex" justifyContent="center" marginTop={2}>
                        {filteredKoi.map((koi, index) => {
                            const boxOptionItem = boxOption.find(option => option.fishId === koi.id);
                            return (
                                <Box key={index} display="flex" justifyContent="space-between" marginTop={2}>
                                    <Paper sx={{ padding: 2, flex: 1, margin: 1, textAlign: 'center' }}>
                                        <Typography variant="subtitle1">Kích thước: {koi.size}</Typography>
                                        <Typography variant="h5">Số lượng: {boxOptionItem ? boxOptionItem.quantity : 0}</Typography>
                                    </Paper>
                                </Box>
                            );
                        })}
                    </Box>
                    <Box display="flex" justifyContent="space-around" marginTop={2}>
                        <Paper sx={{ width: '100px', height: '100px', padding: 1, textAlign: 'center' }}>
                            <img src={order.urlCer1} alt={`Koi Fish ${1}`} style={{ width: '100%', height: 'auto' }} />
                        </Paper>
                        <Paper sx={{ width: '100px', height: '100px', padding: 1, textAlign: 'center' }}>
                            <img src={order.urlCer2} alt={`Koi Fish ${2}`} style={{ width: '100%', height: 'auto' }} />
                        </Paper>
                        <Paper sx={{ width: '100px', height: '100px', padding: 1, textAlign: 'center' }}>
                            <img src={order.urlCer3} alt={`Koi Fish ${3}`} style={{ width: '100%', height: 'auto' }} />
                        </Paper>
                        <Paper sx={{ width: '100px', height: '100px', padding: 1, textAlign: 'center' }}>
                            <img src={order.urlCer4} alt={`Koi Fish ${4}`} style={{ width: '100%', height: 'auto' }} />
                        </Paper>
                    </Box>
                </Paper>
            </Paper>

            <Divider sx={{ marginBottom: 2 }} />

            <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
                <Typography variant="h6">Ghi chú</Typography>
                <Typography></Typography>
            </Paper>

            <Divider sx={{ marginBottom: 2 }} />

            <Paper sx={{ padding: 2, boxShadow: 0 }}>
                <Typography variant="h6">Thông tin chi phí</Typography>

            </Paper>

            <Box display="flex" justifyContent="center" marginTop={2}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleRejectOrder}
                    sx={{ marginRight: 4 }}
                >
                    Từ chối
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAcceptOrder(order.id)}
                >
                    Xác nhận
                </Button>
            </Box>
        </MainCard>
    );
};

export default OrderDetail;