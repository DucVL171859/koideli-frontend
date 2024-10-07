import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getDistance = async () => {
    return await axios.get('/api/v1/Distance', { headers: authHeader() });
}

const getDistanceById = async (id) => {
    return await axios.get(`/api/v1/Distance/${id}`, { headers: authHeader() });
}

const getDistanceEnable = async () => {
    return await axios.get('/api/v1/Distance/enable', { headers: authHeader() });
}

const createDistance = async () => {
    return await axios.post(`/api/v1/Distance`, { headers: authHeader() });
}

const updateDistance = async (id) => {
    return await axios.put(`/api/v1/Distance/${id}`, { headers: authHeader() });
}

const deleteDistance = async (id) => {
    return await axios.delete(`/api/v1/Distance/${id}`, { headers: authHeader() });
}

export default {
    getDistance,
    getDistanceById,
    getDistanceEnable,
    createDistance,
    updateDistance,
    deleteDistance
}