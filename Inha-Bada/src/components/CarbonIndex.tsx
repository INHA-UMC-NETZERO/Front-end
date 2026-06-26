import { Leaf } from "lucide-react";

const CarbonIndex = () => {
    // 사이드바용 간단한 탄소 지표 요약
    const totalCarbonSaved = 6.7;
    const totalItems = 5;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Leaf size={18} className="text-green-600" />
                <h3 className="text-body-14B text-base-800">탄소중립 지표</h3>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-caption-12M text-base-500">누적 CO₂ 절감</span>
                <span className="text-body-14B text-green-500">
                    {totalCarbonSaved.toFixed(1)} kg
                </span>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-caption-12M text-base-500">나눔 횟수</span>
                <span className="text-body-14B text-green-500">
                    {totalItems}회
                </span>
            </div>

            {/* 간단한 진행 바 */}
            <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: "40%" }}
                />
            </div>
            <p className="text-caption-12M text-base-400">
                월 목표 대비 40% 달성
            </p>
        </div>
    );
};

export default CarbonIndex;
