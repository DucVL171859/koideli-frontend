import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getOrderTimeline = async () => {
    return await axios.get('/api/v1/OrderTimeline', { headers: authHeader() });
}

const getOrderTimelineByName = async (name) => {
    return await axios.get(`/api/v1/OrderTimeline/${name}`, { headers: authHeader() });
}

const createOrderTimeline = async () => {
    return await axios.post(`/api/v1/OrderTimeline/{'orderTimeline'}`, { headers: authHeader() });
}

const updateOrderTimeline = async (id) => {
    return await axios.put(`/api/v1/OrderTimeline/${id}`, { headers: authHeader() });
}

const deleteOrderTimeline = async (id) => {
    return await axios.delete(`/api/v1/OrderTimeline/${id}`, { headers: authHeader() });
}

export default {
    getOrderTimeline,
    getOrderTimelineByName,
    createOrderTimeline,
    updateOrderTimeline,
    deleteOrderTimeline
}