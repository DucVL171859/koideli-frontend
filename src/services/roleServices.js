import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getRole = async () => {
    return await axios.get('/api/v1/Role ', { headers: authHeader() });
}

const getRoleById = async (id) => {
    return await axios.get(`/api/v1/Role/id?id=${id}`, { headers: authHeader() });
}

const getRoleEnable = async () => {
    return await axios.get(`/api/v1/Role/enable`, { headers: authHeader() });
}

const createRole = async () => {
    return await axios.post(`/api/v1/Role /{'order'}`, { headers: authHeader() });
}

const updateRole = async (id) => {
    return await axios.put(`/api/v1/Role /${id}`, { headers: authHeader() });
}

const deleteRole = async (id) => {
    return await axios.delete(`/api/v1/Role /${id}`, { headers: authHeader() });
}

export default {
    getRole,
    getRoleById,
    getRoleEnable,
    createRole,
    updateRole,
    deleteRole
}