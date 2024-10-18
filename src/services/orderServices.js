import axios from "api/axios";
import authHeader from "./authHeaderServices";
import { dark } from "@mui/material/styles/createPalette";

const getOrder = async () => {
    return await axios.get('/api/v1/Order', { headers: authHeader() });
}

const getOrderById = async (id) => {
    return await axios.get(`/api/v1/Order/id`,
        {
            params: {
                id: id
            }
        },
        { headers: authHeader() }
    );
}

const createOrder = async () => {
    return await axios.post(`/api/v1/Order/{'order'}`, { headers: authHeader() });
}

const updateOrder = async (id, updatedData) => {
    return await axios.put(`/api/v1/Order?id=${id}`,
        {
            params: {
                id: id
            }
        },
        updatedData,
        { headers: authHeader() }
    );
}

const deleteOrder = async (id) => {
    return await axios.delete(`/api/v1/Order/${id}`, { headers: authHeader() });
}

export default {
    getOrder,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
}