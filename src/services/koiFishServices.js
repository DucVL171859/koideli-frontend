import config from "api/axios";
import authHeader from "./authHeaderServices";

const getKoiFish = async () => {
  try {
    // Add the Authorization header with the token
    const response = await config.get(`/api/v1/KoiFish`, {
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

const getKoiFishById = async (id) => {
  return await config.get(`/api/v1/KoiFish/id?id=${id}`, { headers: authHeader() });
}

const createKoiFish = async () => {
  return await config.post(`/api/v1/KoiFish/{'koiFish'}`, { headers: authHeader() });
}

const updateKoiFish = async (id) => {
  return await config.put(`/api/v1/KoiFish/${id}`, { headers: authHeader() });
}

const deleteKoiFish = async (id) => {
  return await config.delete(`/api/v1/KoiFish/${id}`, { headers: authHeader() });
}

export default {
  getKoiFish,
  getKoiFishById,
  createKoiFish,
  updateKoiFish,
  deleteKoiFish
}