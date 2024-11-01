import config from "api/axios";
import authHeader from "./authHeaderServices";

const getProfileAPI = async () => {
  try {
    // Add the Authorization header with the token
    const response = await config.get(`/api/v1/User/me`, {
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

const getAllUser = async () => {
  return await config.get(`/api/v1/User`, { headers: authHeader() });
}

const getUserById = async (id) => {
  return await config.get(`/api/v1/User/id`, {
    headers: authHeader(),
    params: {
      id: id,
    },
  });
};

const createUser = async () => {
  return await config.post(`/api/v1/User}`, { headers: authHeader() });
};

const updateUser = async (id, profileData) => {
  try {
    // Include the id in the API endpoint
    const response = await config.put(`/api/v1/User/?id=${id}`, profileData, {
      headers: authHeader(),
    });

    if (response.status === 200) {
      return response.data; // Return updated profile data
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  return await config.delete(`/api/v1/User/${id}`, { headers: authHeader() });
};

export default {
  getProfileAPI,
  getUserById,
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
};
