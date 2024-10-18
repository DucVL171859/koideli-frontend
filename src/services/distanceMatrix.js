import axios from "api/axios";
import authHeader from "./authHeaderServices";

const getDistanceMatrixAPI = async (origin, destination) => {
  try {
    const apiKey =
      "u09Dc2XJrqT2BLe35fNjw1LMNDWqzELE787NVAAQhBsjNSaqSLwRy7ivqafnPKCW";

    const response = await fetch(
      `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`
    );

    const data = await response.json();

    // Check if the status is OK
    if (data.rows[0].elements[0].status === "OK") {
      // Extract distance in meters and convert to kilometers
      const distanceInKm = data.rows[0].elements[0].distance.value / 1000;
      return {
        success: true,
        distance: distanceInKm,
      };
    } else {
      throw new Error("Error calculating distance");
    }
  } catch (error) {
    console.error("Error calling Distance Matrix API:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};

export default getDistanceMatrixAPI;
