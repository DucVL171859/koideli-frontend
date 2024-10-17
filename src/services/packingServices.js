import config from "api/axios";
import authHeader from "./authHeaderServices";

const estimatePacking = async (requestBody) => {
  try {
    const response = await config.post("/api/v1/Packing/optimize", requestBody);
    return response.data;
  } catch (error) {
    console.error("Error in packing estimation API:", error);
    return { success: false, message: "Error estimating packing." };
  }
};

export default estimatePacking;
