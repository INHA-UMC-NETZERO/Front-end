import type { CarbonRankingResponse } from "../types/ranking";
import axiosInstance from "./axios";

export const getCarbonMonthlyRanking = async (limit = 5): Promise<CarbonRankingResponse> => {
    const response = await axiosInstance.get("/api/rankings/carbon/monthly", {
        params: { limit },
    });
    return response.data;
};
