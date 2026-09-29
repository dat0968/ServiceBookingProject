import axios from 'axios'
const api = axios.create({
    baseURL: "https://localhost:7204/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentUrl =
                window.location.pathname + window.location.search;

            window.location.href = `/login?returnUrl=${encodeURIComponent(currentUrl)}`;
        }

        return Promise.reject(error);
    }
);
export default api;