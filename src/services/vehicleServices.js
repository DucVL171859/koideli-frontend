import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getVehicle = async () => {
    return await axios.get('/api/v1/Vehicle', { headers: authHeader() });
}

const getVehicleById = async (id) => {
    return await axios.get(`/api/v1/Vehicle/id?id=${id}`, { headers: authHeader() });
}

const createVehicle = async () => {
    return await axios.post(`/api/v1/Order/{'vehicle'}`, { headers: authHeader() });
}

const updateVehicle = async (id) => {
    return await axios.put(`/api/v1/Order/${id}`, { headers: authHeader() });
}

const deleteVehicle = async (id) => {
    return await axios.delete(`/api/v1/Order/${id}`, { headers: authHeader() });
}

export default {
    getVehicle,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
}