import config from "api/axios";
import authHeader from "./authHeaderServices";

const getBox = async () => {
  try {
    // Add the Authorization header with the token
    const response = await config.get(`/api/v1/Box`);

    if (response.status === 200) {
      return response.data; // Return profile data
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

const getBoxByName = async (name) => {
  return await config.get(`/api/v1/Box/${name}`, { headers: authHeader() });
}

const getBoxEnable = async () => {
  return await config.get(`/api/v1/Box/enable`, { headers: authHeader() });
}

const createBox = async () => {
  return await config.post(`/api/v1/Box/{'box'}`, { headers: authHeader() });
}

const updateBox = async (id, updatedBox) => {
  return await config.put(`/api/v1/Box?id=${id}`, updatedBox, { headers: authHeader() });
}

const deleteBox = async (id) => {
  return await config.delete(`/api/v1/Box?id=${id}`, { headers: authHeader() });
}

export default {
  getBox,
  getBoxByName,
  getBoxEnable,
  createBox,
  updateBox,
  deleteBox
}