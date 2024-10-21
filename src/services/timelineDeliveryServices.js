import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getTimelineDelivery = async () => {
    return await axios.get('/api/v1/TimelineDelivery', { headers: authHeader() });
}

const getTimelineDeliveryEnable = async () => {
    return await axios.get('/api/v1/TimelineDelivery/enable', { headers: authHeader() });
}

const getTimelineDeliveryById = async (id) => {
    return await axios.get(`/api/v1/TimelineDelivery/id?id=${id}`, { headers: authHeader() });
}

const createTimelineDelivery = async () => {
    return await axios.post(`/api/v1/TimelineDelivery/{'timelineDelivery'}`, { headers: authHeader() });
}

const updateTimelineDelivery = async (id) => {
    return await axios.put(`/api/v1/TimelineDelivery/${id}`, { headers: authHeader() });
}

const deleteTimelineDelivery = async (id) => {
    return await axios.delete(`/api/v1/TimelineDelivery/${id}`, { headers: authHeader() });
}

export default {
    getTimelineDelivery,
    getTimelineDeliveryEnable,
    getTimelineDeliveryById,
    createTimelineDelivery,
    updateTimelineDelivery,
    deleteTimelineDelivery
}