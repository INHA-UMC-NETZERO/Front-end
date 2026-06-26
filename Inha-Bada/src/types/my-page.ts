export type RequestStatus = "신청중" | "예약중" | "전달완료" | "거절됨";
export type PostStatus = "나눔중" | "마감";

// 마이페이지 요약
export interface MyPageProfile {
    userId: number;
    nickname: string;
    email: string;
    affiliation: string;
    profileImageUrl: string;
}

export interface MyPageActivity {
    sharedCount: number;
    receivedCount: number;
    completedDeliveryCount: number;
    deliveryCompletionRate: number;
}

export interface MyPageCarbon {
    totalCarbonSavingGram: number;
}

export interface MonthlyCarbon {
    month: string;
    carbonSavingGram: number;
}

export interface MyPageSummaryResponse {
    profile: MyPageProfile;
    activity: MyPageActivity;
    carbon: MyPageCarbon;
    monthlyCarbon: MonthlyCarbon[];
}

// 내가 신청한 요청 목록
export interface MyPageRequest {
    requestId: number;
    postId: number;
    postTitle: string;
    postCategory: string;
    postSubCategory: string;
    postLocation: string;
    quantity: number;
    requestedTime: string;
    carbonSavingGram: number;
    completedAt: string | null;
    status: RequestStatus;
    createdAt: string;
}

export type MyPageSummaryRequestsResponse = MyPageRequest[];

// 내가 등록한 게시물의 신청 요청
export interface MyPagePostRequest {
    requestId: number;
    receiverId: number;
    receiverName: string;
    quantity: number;
    requestedTime: string;
    status: RequestStatus;
    createdAt: string;
}

// 내가 등록한 게시물
export interface MyPagePost {
    postId: number;
    title: string;
    category: string;
    subCategory: string;
    location: string;
    thumbnailUrl: string;
    remainingQuantity: number;
    totalQuantity: number;
    unitCarbonSavingGram: number;
    completedCarbonSavingGram: number;
    status: PostStatus;
    closed: boolean;
    createdAt: string;
    requests: MyPagePostRequest[];
}

export type MyPageSummaryPostsResponse = MyPagePost[];
