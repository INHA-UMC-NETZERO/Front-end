export type NotificationType = "KEYWORD_MATCH" | "REQUEST" | "APPROVED" | "REJECTED" | "COMPLETED";

export interface NotificationItem {
    id: number;
    type: NotificationType;
    message: string;
    relatedPostId: number;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationListResponse {
    content: NotificationItem[];
    totalElements: number;
    page: number;
    size: number;
    hasNext: boolean;
}

export type Pageable = {
    page: number;
    size: number;
    sort?: string[];
};
