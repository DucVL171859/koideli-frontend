import config from "api/axios";
import authHeader from "./authHeaderServices";

const getFeedback = async () => {
  try {
    // Add the Authorization header with the token
    const response = await config.get(`/api/v1/Feedback`, {
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


const getFeedbackById = async (id) => {
  return await config.get(`/api/v1/Feedback/id?id=${id}`, { headers: authHeader() });
}

const getFeedbackEnable = async () => {
  return await config.get('/api/v1/Feedback/enable', { headers: authHeader() });
}

const createFeedback = async () => {
  return await config.post(`/api/v1/Feedback`, { headers: authHeader() });
}

const updateFeedback = async (id, updatedData) => {
  return await config.put(`/api/v1/Feedback?id=${id}`, updatedData, { headers: authHeader() });
}

const deleteFeedback = async (id) => {
  return await config.delete(`/api/v1/Feedback/${id}`, { headers: authHeader() });
}

export default {
  getFeedback,
  getFeedbackById,
  getFeedbackEnable,
  createFeedback,
  updateFeedback,
  deleteFeedback
}