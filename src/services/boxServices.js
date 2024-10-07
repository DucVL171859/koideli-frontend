import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getBox = async () => {
    return await axios.get('/api/v1/Box', { headers: authHeader() });
}

const getBoxByName = async (name) => {
    return await axios.get(`/api/v1/Box/${name}`, { headers: authHeader() });
}

const createBox = async () => {
    return await axios.post(`/api/v1/Box/{'box'}`, { headers: authHeader() });
}

const updateBox = async (id, updatedBox) => {
    return await axios.put(`/api/v1/Box/${id}`, updatedBox, { headers: authHeader() });
}

const deleteBox = async (id) => {
    return await axios.delete(`/api/v1/Box/${id}`, { headers: authHeader() });
}

export default {
    getBox,
    getBoxByName,
    createBox,
    updateBox,
    deleteBox
}