import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getBoxOption = async () => {
    return await axios.get('/api/v1/BoxOption', { headers: authHeader() });
}

const getBoxOptionByName = async (name) => {
    return await axios.get(`/api/v1/BoxOption/${name}`, { headers: authHeader() });
}

const createBoxOption = async () => {
    return await axios.post(`/api/v1/BoxOption/{'boxOption'}`, { headers: authHeader() });
}

const updateBoxOption = async (id) => {
    return await axios.put(`/api/v1/BoxOption/${id}`, { headers: authHeader() });
}

const deleteBoxOption = async (id) => {
    return await axios.delete(`/api/v1/BoxOption/${id}`, { headers: authHeader() });
}

export default {
    getBoxOption,
    getBoxOptionByName,
    createBoxOption,
    updateBoxOption,
    deleteBoxOption
}