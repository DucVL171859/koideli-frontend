import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getTransaction = async () => {
    return await axios.get('/api/v1/Transaction', { headers: authHeader() });
}

const getTransactionEnable = async () => {
    return await axios.get(`/api/v1/Transaction/enable`, { headers: authHeader() });
}

const getTransactionById = async (id) => {
    return await axios.get(`/api/v1/Transaction/${id}`, { headers: authHeader() });
}

const createTransaction = async () => {
    return await axios.post(`/api/v1/Order`, { headers: authHeader() });
}

const deleteOrder = async (id) => {
    return await axios.delete(`/api/v1/Order/${id}`, { headers: authHeader() });
}

export default {
    getTransaction,
    getTransactionEnable,
    getTransactionById,
    createTransaction,
    deleteOrder
}