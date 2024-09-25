import axios from "axios"
import authHeader from "../services/authHeaderServices";

const api = axios.create({
    baseURL: 'https://vpack-ecomerce.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        let token = authHeader().Authorization;
        if (token) config.headers['Authorization'] = token;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;