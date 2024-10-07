import axios from "axios"
import authHeader from "services/authHeaderServices";

const config = axios.create({
    baseURL: 'https://koideli.azurewebsites.net',
    headers: {
        'Content-Type': 'application/json',
    }
});

config.interceptors.request.use(
    (config) => {
        let token = authHeader().Authorization;
        if (token) config.headers['Authorization'] = token;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default config;