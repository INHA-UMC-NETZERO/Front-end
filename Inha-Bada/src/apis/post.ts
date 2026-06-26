import type { PostControllerRequest, PostControllerResponse } from "../types/post";
import axiosInstance from "./axios";

export const postFeed = async (userId: number, data: PostControllerRequest): Promise<PostControllerResponse> => {
    const response = await axiosInstance.post(`/api/posts`, data, {
        params: {
            userId,
        },
    });

    return response.data;
};
