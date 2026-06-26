import type { RequestPostRequest, RequestPostResponse } from "../types/request";
import axiosInstance from "./axios";
import { getUserId } from "../utils/auth";

export const postPostsRequest = async (postId: number, data: RequestPostRequest): Promise<RequestPostResponse> => {
    const response = await axiosInstance.post(`/api/posts/${postId}/requests`, data, {
        params: { userId: getUserId() },
    });
    return response.data;
};

export const patchPostsApprove = async (id: number) => {
    const response = await axiosInstance.patch(`/api/requests/${id}/approve`, null, {
        params: { userId: getUserId() },
    });
    return response.data;
};

export const patchPostsReject = async (id: number) => {
    const response = await axiosInstance.patch(`/api/requests/${id}/reject`, null, {
        params: { userId: getUserId() },
    });
    return response.data;
};

export const patchPostsComplete = async (id: number) => {
    const response = await axiosInstance.patch(`/api/requests/${id}/complete`, null, {
        params: { userId: getUserId() },
    });
    return response.data;
};
