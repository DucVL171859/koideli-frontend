import config from "api/axios";
import authHeader from "./authHeaderServices";

const getWallet = async () => {
  return await config.get("/api/v1/Wallet", { headers: authHeader() });
};

const getWalletEnable = async (name) => {
  return await config.get(`/api/v1/Wallet/${name}`, { headers: authHeader() });
};

const getWalletById = async (id) => {
  return await config.get(`/api/v1/Wallet?id=${id}`, { headers: authHeader() });
};

const createWallet = async (walletData) => {
  return await config.post(`/api/v1/Wallet`, walletData, { headers: authHeader() });
};


const updateWallet = async (id, data) => {
  return await config.put(`/api/v1/Wallet?id=${id}`, data, { headers: authHeader() });
};

const deleteWallet = async (id) => {
  return await config.delete(`/api/v1/Wallet/${id}`, { headers: authHeader() });
};

const rechargeAPI = async ({ amount, transactionId }) => {
  try {
    const response = await config.post("/api/v1/Wallet/wallets/deposit", null, {
      params: {
        amount,
        CommonId: transactionId,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error during recharge:", error);
    throw error;
  }
};


export default {
  getWallet,
  getWalletEnable,
  getWalletById,
  createWallet,
  updateWallet,
  deleteWallet,
  rechargeAPI,
};
