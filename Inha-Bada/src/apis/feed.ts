import type { FeedControllerGetResponse, FeedControllerPostResponse, Pageable } from "../types/feed";
import axiosInstance from "./axios";

export const getFeeds = async (category: string, keyword: string, pageable: Pageable): Promise<FeedControllerPostResponse> => {
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

export const getFeedId = async (id: number): Promise<FeedControllerGetResponse> => {
    const response = await axiosInstance.get(`/api/posts/${id}`);

    return response.data;
}