import axios from "api/axios";

const login = async (loginData) => {
    return await axios.post('/api/v1/Authentication/login', loginData);
}

const register = async (registerData) => {
    return await axios.post('/api/v1/Authentication/register', registerData);
}

const logout = () => {
    sessionStorage.clear();
}

export default {
    login,
    register,
    logout
}