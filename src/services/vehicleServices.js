import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getVehicle = async () => {
    return await axios.get('/api/v1/Order', { headers: authHeader() });
}

const getVehicleByName = async (name) => {
    return await axios.get(`/api/v1/Order/${name}`, { headers: authHeader() });
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
    getVehicleByName,
    createVehicle,
    updateVehicle,
    deleteVehicle
}