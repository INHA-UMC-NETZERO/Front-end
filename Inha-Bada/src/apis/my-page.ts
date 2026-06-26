import type {
    MyPageSummaryResponse,
    MyPageSummaryRequestsResponse,
    MyPageSummaryPostsResponse,
} from "../types/my-page";
import axiosInstance from "./axios";
import { getUserId } from "../utils/auth";

// 마이페이지 요약 (프로필, 활동, 누적 탄소, 월별 탄소)
export const getMyPageSummary = async (): Promise<MyPageSummaryResponse> => {
    const response = await axiosInstance.get("/api/mypage/summary", {
        params: { userId: getUserId() },
    });
    return response.data;
};

// 내 신청 목록
export const getMyPageRequests = async (): Promise<MyPageSummaryRequestsResponse> => {
    const response = await axiosInstance.get("/api/mypage/requests", {
        params: { userId: getUserId() },
    });
    return response.data;
};

// 내 게시글 목록
export const getMyPagePosts = async (): Promise<MyPageSummaryPostsResponse> => {
    const response = await axiosInstance.get("/api/mypage/posts", {
        params: { userId: getUserId() },
    });
    return response.data;
};
