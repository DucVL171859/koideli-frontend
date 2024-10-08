import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getTimelineDelivery = async () => {
    return await axios.get('/api/v1/TimelineDelivery', { headers: authHeader() });
}

const getTimelineDeliveryByName = async (name) => {
    return await axios.get(`/api/v1/TimelineDelivery/${name}`, { headers: authHeader() });
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
    getTimelineDeliveryByName,
    createTimelineDelivery,
    updateTimelineDelivery,
    deleteTimelineDelivery
}