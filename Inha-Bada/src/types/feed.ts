export type Pageable = {
    page: number;
    size: number;
    sort?: string[];
};

export interface FeedItem {
    id: number;
    title: string;
    thumbnailUrl: string;
    remainingQuantity: number;
    category: string;
    status: "ACTIVE" | "CLOSED";
    closed: boolean;
}

export type FeedControllerPostResponse = {
    content: FeedItem[];
    totalElements: number;
    page: number;
    size: number;
    hasNext: boolean;
};

export interface FeedSlot {
    id: number;
    startTime: string;
    endTime: string;
}

export type FeedControllerGetResponse = {
    id: number;
    title: string;
    description: string;
    category: string;
    imageUrls: string[];
    remainingQuantity: number;
    totalQuantity: number;
    giverId: number;
    giverName: string;
    status: "ACTIVE" | "CLOSED";
    closed: boolean;
    createdAt: string;
    slots: FeedSlot[];
};