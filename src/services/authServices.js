import config from "api/axios";

const loginAPI = async (email, password) => {
    try {
      const response = await config.post("/api/v1/Authentication/login", {
        email,
        password,
      });
  
      if (response.status === 200) {
        return response.data; // Return the entire response data
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };
  

const register = async (registerData) => {
    return await config.post('/api/v1/Authentication/register', registerData);
}

const logout = () => {
    sessionStorage.clear();
}

export default {
    loginAPI,
    register,
    logout
}