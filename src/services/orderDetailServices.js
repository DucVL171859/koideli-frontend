import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getOrderDetail = async () => {
    return await axios.get('/api/v1/OrderDetail', { headers: authHeader() });
}

const getOrderDetailById = async (id) => {
    return await axios.get(`/api/v1/OrderDetail/id?id=${id}`, { headers: authHeader() });
}

const createOrderDetail = async (OrderDetail) => {
    return await axios.post(`/api/v1/OrderDetail`, OrderDetail, { headers: authHeader() });
}

const updateOrderDetail = async (id) => {
    return await axios.put(`/api/v1/OrderDetail/${id}`, { headers: authHeader() });
}

const deleteOrderDetail = async (id) => {
    return await axios.delete(`/api/v1/OrderDetail/${id}`, { headers: authHeader() });
}

export default {
    getOrderDetail,
    getOrderDetailById,
    createOrderDetail,
    updateOrderDetail,
    deleteOrderDetail
}