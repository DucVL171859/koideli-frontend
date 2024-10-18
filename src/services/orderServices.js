import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getOrder = async () => {
  return await axios.get("/api/v1/Order", { headers: authHeader() });
};

const getOrderByName = async (name) => {
  return await axios.get(`/api/v1/Order/${name}`, { headers: authHeader() });
};

// Create Box Option by passing 'boxOption' object in request body
const createOrder = async (Order) => {
  return await axios.post("/api/v1/Order", Order, {
    headers: authHeader(),
  });
};
const updateOrder = async (id) => {
  return await axios.put(`/api/v1/Order/${id}`, { headers: authHeader() });
};

const deleteOrder = async (id) => {
  return await axios.delete(`/api/v1/Order/${id}`, { headers: authHeader() });
};

export default {
  getOrder,
  getOrderByName,
  createOrder,
  updateOrder,
  deleteOrder,
};
