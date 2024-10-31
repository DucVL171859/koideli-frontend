import config from "api/axios";
import authHeader from "./authHeaderServices";

const getDistance = async () => {
  try {
    // Add the Authorization header with the token
    const response = await config.get(`/api/v1/Distance`, {
      headers: authHeader(), // Passing token in Authorization header
    });

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


const getDistanceById = async (id) => {
  return await config.get(`/api/v1/Distance/id?id=${id}`, { headers: authHeader() });
}

const getDistanceEnable = async () => {
  return await config.get('/api/v1/Distance/enable', { headers: authHeader() });
}

const createDistance = async () => {
  return await config.post(`/api/v1/Distance`, { headers: authHeader() });
}

const updateDistance = async (id, updatedData) => {
  return await config.put(`/api/v1/Distance?id=${id}`, updatedData, { headers: authHeader() });
}

const deleteDistance = async (id) => {
  return await config.delete(`/api/v1/Distance/${id}`, { headers: authHeader() });
}

export default {
  getDistance,
  getDistanceById,
  getDistanceEnable,
  createDistance,
  updateDistance,
  deleteDistance
}