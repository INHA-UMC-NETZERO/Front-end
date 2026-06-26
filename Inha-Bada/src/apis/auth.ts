import type { LoginRequest, LoginResponse } from "../types/auth";
import axiosInstance from "./axios";

export const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/api/auth/login", data);
    return response.data;
};

export const postLogout = async () => {
    const response = await axiosInstance.post("/api/auth/logout");
    return response.data;
};
