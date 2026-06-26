export interface UserRequest {
    requestId: number;
    postId: number;
    postTitle: string;
    quantity: number;
    availableTime: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
}

export type UserGetResponse = UserRequest[];

export interface PostRequest {
    requestId: number;
    receiverId: number;
    receiverName: string;
    quantity: number;
    availableTime: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
    createdAt: string;
}

export interface UserPost {
    postId: number;
    title: string;
    category: string;
    thumbnailUrl: string;
    remainingQuantity: number;
    totalQuantity: number;
    status: "ACTIVE" | "CLOSED";
    closed: boolean;
    createdAt: string;
    requests: PostRequest[];
}

export type UserGetPostResponse = UserPost[];
