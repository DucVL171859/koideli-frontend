import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getOrderDetailInfo = async (id) => {
    return await axios.get(`/api/v1/Delivery/order-detail-infor?orderDetailID=${id}`, { headers: authHeader() });
}

const getOrderDetailInTimeline = async (id) => {
    return await axios.get(`/api/v1/Delivery/view-all-order-detail-in-timeline?timelineID=${id}`, { headers: authHeader() });
}

const createTimeline = async (timelineInfo) => {
    return await axios.post(`/api/v1/Delivery/multiple-timelines`, timelineInfo, { headers: authHeader() });
}

const createOrderTimeline = async (orderTimelineInfo) => {
    return await axios.post(`/api/v1/Delivery/assign-ordetail-timeline`, orderTimelineInfo, { headers: authHeader() });
}

export default {
    getOrderDetailInfo,
    getOrderDetailInTimeline,
    createTimeline,
    createOrderTimeline
}