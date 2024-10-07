import axios from "api/axios";
import authHeader from "./authHeaderServices";

const createPacking = async () => {
    return await axios.post('/api/v1/Packing/optimize', { headers: authHeader() });
}

export default createPacking;