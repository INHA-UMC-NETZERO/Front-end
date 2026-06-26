export interface PostSlot {
    startTime: string;
    endTime: string;
}

export type PostControllerRequest = {
    title: string;
    description: string;
    category: string;
    subCategory: string;
    imageKeys: string[];
    totalQuantity: number;
    location: string;
    slots: PostSlot[];
};

export interface PostSlotResponse {
    id: number;
    startTime: string;
    endTime: string;
}

export type PostControllerResponse = {
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
    slots: PostSlotResponse[];
};
