import type { CreatePostRequest, CreatePostResponse } from "../types/post";
import axiosInstance from "./axios";
import { getUserId } from "../utils/auth";

export const postFeed = async (data: CreatePostRequest): Promise<CreatePostResponse> => {
    const response = await axiosInstance.post(`/api/posts`, data, {
        params: { userId: getUserId() },
    });
    return response.data;
};

export const patchFeed = async (id: number) => {
    const response = await axiosInstance.patch(`/api/posts/${id}/close`, null, {
        params: { userId: getUserId() },
    });
    return response.data;
};
