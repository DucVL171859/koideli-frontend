import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getBoxOption = async () => {
  return await axios.get("/api/v1/BoxOption", { headers: authHeader() });
};

const getBoxOptionByName = async (name) => {
  return await axios.get(`/api/v1/BoxOption/${name}`, {
    headers: authHeader(),
  });
};

// Create Box Option by passing 'boxOption' object in request body
const createBoxOption = async (boxOption) => {
  try {
    const response = await axios.post("/api/v1/BoxOption", boxOption, {
      headers: {
        headers: authHeader(), // Ensure Authorization header is included
      },
    });

    // If the response status is OK (200), return the response data
    if (response.status === 200 && response.data.success) {
      return response.data; // Return the successful data from the response
    } else {
      throw new Error(response.data.message || "Failed to create box option.");
    }
  } catch (error) {
    console.error("Error during API call to create BoxOption:", error.message);
    throw error; // Re-throw error to handle it in the calling function
  }
};

// Update Box Option by passing 'id' and 'boxOption' object in request body
const updateBoxOption = async (id, boxOption) => {
  return await axios.put(`/api/v1/BoxOption/${id}`, boxOption, {
    headers: authHeader(),
  });
};

const deleteBoxOption = async (id) => {
  return await axios.delete(`/api/v1/BoxOption/${id}`, {
    headers: authHeader(),
  });
};

export default {
  getBoxOption,
  getBoxOptionByName,
  createBoxOption,
  updateBoxOption,
  deleteBoxOption,
};
