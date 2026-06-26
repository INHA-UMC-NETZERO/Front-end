import { postLogin } from "../apis/auth";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await postLogin(data);

    // 토큰과 유저 정보를 localStorage에 저장
    localStorage.setItem("accessToken", response.token);
    localStorage.setItem("userId", String(response.userId));
    localStorage.setItem("userEmail", response.email || data.email);
    localStorage.setItem("userNickname", data.nickname);

    return response;
};

export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userNickname");
};

export const getUserId = (): number | null => {
    const id = localStorage.getItem("userId");
    return id ? Number(id) : null;
};

export const getToken = (): string | null => {
    return localStorage.getItem("accessToken");
};

export const isLoggedIn = (): boolean => {
    return !!localStorage.getItem("accessToken");
};
