import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getKoiFish = async () => {
    return await axios.get('/api/v1/KoiFish', { headers: authHeader() });
}

const getKoiFishByName = async (name) => {
    return await axios.get(`/api/v1/KoiFish/${name}`, { headers: authHeader() });
}

const createKoiFish = async () => {
    return await axios.post(`/api/v1/KoiFish/{'koiFish'}`, { headers: authHeader() });
}

const updateKoiFish = async (id) => {
    return await axios.put(`/api/v1/KoiFish/${id}`, { headers: authHeader() });
}

const deleteKoiFish = async (id) => {
    return await axios.delete(`/api/v1/KoiFish/${id}`, { headers: authHeader() });
}

export default {
    getKoiFish,
    getKoiFishByName,
    createKoiFish,
    updateKoiFish,
    deleteKoiFish
}