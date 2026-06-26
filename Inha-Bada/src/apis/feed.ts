import type { PostDetail, PostListResponse, Pageable } from "../types/post";
import axiosInstance from "./axios";

export const getFeeds = async (category: string, keyword: string, pageable: Pageable): Promise<PostListResponse> => {
    const params: Record<string, string | number | undefined> = {
        page: pageable.page,
        size: pageable.size,
    };

    if (category) params.category = category;
    if (keyword) params.keyword = keyword;

    // sort 파라미터: "createdAt,desc" 형태
    if (pageable.sort && pageable.sort.length > 0) {
        params.sort = pageable.sort[0];
    }

    const response = await axiosInstance.get(`/api/posts`, { params });

    return response.data;
}

export const getFeedId = async (id: number): Promise<PostDetail> => {
    const response = await axiosInstance.get(`/api/posts/${id}`);

    return response.data;
}