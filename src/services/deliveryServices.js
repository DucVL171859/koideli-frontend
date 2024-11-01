import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getOrderDetailInfo = async (id) => {
    return await axios.get(`/api/v1/Delivery/order-detail-infor?orderDetailID=${id}`, { headers: authHeader() });
}

const getOrderDetailInTimeline = async (id) => {
    return await axios.get(`/api/v1/Delivery/view-all-order-detail-in-timeline?timelineID=${id}`, { headers: authHeader() });
}

const getSuitableTimeline = async (orderDetailID, arrayOfBranches, startDay) => {
    let branches = arrayOfBranches.map(branch => `branch=${branch}`).join('&');
    return await axios.get(`/api/v1/Delivery/suitable-timelines?orderDetailID=${orderDetailID}&${branches}&startDay=${startDay}`);
}

const createTimeline = async (timelineInfo) => {
    return await axios.post(`/api/v1/Delivery/multiple-timelines`, timelineInfo, { headers: authHeader() });
}

const createOrderTimeline = async (orderTimelineInfo) => {
    return await axios.post(`/api/v1/Delivery/assign-ordetail-timeline`, orderTimelineInfo, { headers: authHeader() });
}

const updateTimelineStatus = async (timelineId) => {
    return await axios.put(`/api/v1/Delivery/update-timeline-status?timelineID=${timelineId}`, { headers: authHeader() });
}

export default {
    getOrderDetailInfo,
    getOrderDetailInTimeline,
    getSuitableTimeline,
    createTimeline,
    createOrderTimeline,
    updateTimelineStatus
}