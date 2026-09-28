import axios from 'axios'
const api = axios.create({
    baseURL: "https://localhost:7204/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default api;