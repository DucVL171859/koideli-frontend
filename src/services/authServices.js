import axios from "../api/aixos";

const login = async (loginData) => {
    return await axios.post('/api/users/auth', loginData);
}

const register = async (registerData) => {
    return await axios.post('/api/users/register', registerData);
}

const logout = () => {
    sessionStorage.clear();
}

export default {
    login,
    register,
    logout
}