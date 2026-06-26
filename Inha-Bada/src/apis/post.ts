import type { CreatePostRequest, CreatePostResponse } from "../types/post";
import axiosInstance from "./axios";

export const postFeed = async (userId: number, data: CreatePostRequest): Promise<CreatePostResponse> => {
    const response = await axiosInstance.post(`/api/posts`, data, {
        params: {
            userId,
        },
    });

    return response.data;
};
