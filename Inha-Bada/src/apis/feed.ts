import type { PostDetail, PostListResponse, Pageable } from "../types/post";
import axiosInstance from "./axios";

export const getFeeds = async (category: string, keyword: string, pageable: Pageable): Promise<PostListResponse> => {
    const response = await axiosInstance.get(`/api/posts`, {
        params: {
            category: category || undefined,
            keyword: keyword || undefined,
            page: pageable.page,
            size: pageable.size,
            sort: pageable.sort?.join(",") || undefined,
        },
    });

    return response.data;
}

export const getFeedId = async (id: number): Promise<PostDetail> => {
    const response = await axiosInstance.get(`/api/posts/${id}`);

    return response.data;
}