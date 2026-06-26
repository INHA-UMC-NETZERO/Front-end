import type { UserGetPostResponse, UserGetResponse } from "../types/user";
import axiosInstance from "./axios";
import { getUserId } from "../utils/auth";

export const getUser = async (): Promise<UserGetResponse> => {
    const response = await axiosInstance.get(`/api/mypage/requests`, {
        params: { userId: getUserId() },
    });
    return response.data;
};

export const getUserPosts = async (): Promise<UserGetPostResponse> => {
    const response = await axiosInstance.get(`/api/mypage/posts`, {
        params: { userId: getUserId() },
    });
    return response.data;
};
