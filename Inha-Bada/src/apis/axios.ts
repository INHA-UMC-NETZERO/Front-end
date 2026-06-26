import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL || "http://localhost:8080",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터: localStorage에서 토큰을 가져와 Bearer로 설정
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
