import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import { getMyPageSummary } from "../../apis/my-page";
import { isLoggedIn } from "../../utils/auth";
import { onDataRefresh } from "../../utils/events";

const CarbonIndex = () => {
    const [totalCarbonKg, setTotalCarbonKg] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [completionRate, setCompletionRate] = useState(0);

    useEffect(() => {
        if (!isLoggedIn()) return;
        const fetchData = async () => {
            try {
                const summary = await getMyPageSummary();
                setTotalCarbonKg(summary.carbon.totalCarbonSavingGram / 1000);
                setCompletedCount(summary.activity.completedDeliveryCount);
                setCompletionRate(summary.activity.deliveryCompletionRate);
            } catch (error) {
                console.error("탄소 지표 불러오기 실패:", error);
            }
        };
        fetchData();
        const unsubscribe = onDataRefresh(fetchData);
        return unsubscribe;
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Leaf size={18} className="text-green-600" />
                <h3 className="text-body-14B text-base-800">탄소중립 지표</h3>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-caption-12M text-base-500">누적 CO₂ 절감</span>
                    <span className="text-body-14B text-green-500">
                        {totalCarbonKg.toFixed(1)} kg
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-caption-12M text-base-500">전달 완료</span>
                    <span className="text-body-14B text-green-500">
                        {completedCount}건
                    </span>
                </div>
            </div>

            {/* 진행 바 */}
            <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                />
            </div>
            <p className="text-caption-12M text-base-400">
                전달 완료율 {completionRate}%
            </p>
        </div>
    );
};

export default CarbonIndex;
