import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getUser = async () => {
    return await axios.get('/api/v1/User', { headers: authHeader() });
}

const getUserById = async (id) => {
    return await axios.get(`/api/v1/User/id`,
        {
            headers: authHeader(),
            params: {
                id: id
            }
        });
}

const createUser = async () => {
    return await axios.post(`/api/v1/User}`, { headers: authHeader() });
}

const updateUser = async (id) => {
    return await axios.put(`/api/v1/User/${id}`, { headers: authHeader() });
}

const deleteUser = async (id) => {
    return await axios.delete(`/api/v1/User/${id}`, { headers: authHeader() });
}

export default {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}