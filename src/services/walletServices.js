import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getWallet = async () => {
    return await axios.get('/api/v1/Wallet', { headers: authHeader() });
}

const getWalletEnable = async (name) => {
    return await axios.get(`/api/v1/Wallet/${name}`, { headers: authHeader() });
}

const getWalletById = async (id) => {
    return await axios.get(`/api/v1/Wallet/${id}`, { headers: authHeader() });
}

const createWallet = async () => {
    return await axios.post(`/api/v1/Wallet`, { headers: authHeader() });
}

const updateWallet = async (id) => {
    return await axios.put(`/api/v1/Wallet/${id}`, { headers: authHeader() });
}

const deleteWallet = async (id) => {
    return await axios.delete(`/api/v1/Wallet/${id}`, { headers: authHeader() });
}

export default {
    getWallet,
    getWalletEnable,
    getWalletById,
    createWallet,
    updateWallet,
    deleteWallet
}