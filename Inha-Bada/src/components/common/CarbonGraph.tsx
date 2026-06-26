import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { getCarbonMonthlyRanking } from "../../apis/ranking";
import { onDataRefresh } from "../../utils/events";
import type { CarbonRankingItem } from "../../types/ranking";

const CarbonGraph = () => {
    const [items, setItems] = useState<CarbonRankingItem[]>([]);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const res = await getCarbonMonthlyRanking(5);
                setItems(res.items);
            } catch (error) {
                console.error("랭킹 불러오기 실패:", error);
            }
        };
        fetchRanking();
        const unsubscribe = onDataRefresh(fetchRanking);
        return unsubscribe;
    }, []);

    return (
        <section className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-primary-blue-500" />
                <h2 className="text-body-14B text-base-800">월별 탄소 절감 랭킹</h2>
            </div>

            <div className="flex flex-col gap-2 flex-1">
                {items.length === 0 ? (
                    <p className="text-caption-12R text-base-400 py-4 text-center">
                        랭킹 데이터가 없습니다.
                    </p>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.rank}
                            className="flex items-center justify-between py-2 rounded-lg hover:bg-gray-background transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-body-14B w-5 text-center text-primary-blue-500">
                                    {item.rank}
                                </span>
                                <span className="text-caption-12B text-base-700">{item.nickname}</span>
                            </div>
                            <span className="text-caption-12B text-primary-blue-500">
                                {(item.carbonSavingGram / 1000).toFixed(1)} kg
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default CarbonGraph;
