export type Pageable = {
    page: number;
    size: number;
    sort?: string[];
};

export type PostStatus = "ACTIVE" | "CLOSED";

// 수령 가능 시간대 (서버 응답 — id 포함)
export interface Slot {
    id: number;
    startTime: string;
    endTime: string;
}

// 게시글 생성 시 입력하는 시간대 (id 없음)
export interface SlotInput {
    startTime: string;
    endTime: string;
}

// 목록(피드)용 요약 정보
export interface PostSummary {
    id: number;
    title: string;
    thumbnailUrl: string;
    remainingQuantity: number;
    category: string;
    status: PostStatus;
    closed: boolean;
}

// 목록 응답 (페이지네이션)
export type PostListResponse = {
    content: PostSummary[];
    totalElements: number;
    page: number;
    size: number;
    hasNext: boolean;
};

// 상세 응답
export interface PostDetail {
    id: number;
    title: string;
    description: string;
    category: string;
    imageUrls: string[];
    remainingQuantity: number;
    totalQuantity: number;
    giverId: number;
    giverName: string;
    status: PostStatus;
    closed: boolean;
    createdAt: string;
    slots: Slot[];
}

// 게시글 생성 요청
export type CreatePostRequest = {
    title: string;
    description: string;
    category: string;
    subCategory: string;
    imageKeys: string[];
    totalQuantity: number;
    location: string;
    slots: SlotInput[];
};

// 게시글 생성 응답 (상세와 동일 구조)
export type CreatePostResponse = PostDetail;
