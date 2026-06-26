export interface CarbonRankingItem {
    rank: number;
    userId: number;
    nickname: string;
    carbonSavingGram: number;
}

export interface CarbonRankingResponse {
    yearMonth: string;
    items: CarbonRankingItem[];
}
