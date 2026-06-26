interface CarbonGraphProps {
    monthlyData?: { month: string; value: number }[];
}

const defaultData = [
    { month: "1월", value: 1.2 },
    { month: "2월", value: 2.5 },
    { month: "3월", value: 1.8 },
    { month: "4월", value: 3.4 },
    { month: "5월", value: 4.1 },
    { month: "6월", value: 6.7 },
];

const CarbonGraph = ({ monthlyData = defaultData }: CarbonGraphProps) => {
    const maxValue = Math.max(...monthlyData.map((d) => d.value));

    return (
        <section className="border border-base-300 rounded-2xl p-5">
            <h2 className="text-body-14B text-base-800 mb-4">월별 탄소 절감량</h2>

            <div className="flex items-end justify-between gap-2 h-40">
                {monthlyData.map((data) => {
                    const heightPercent = maxValue > 0 ? (data.value / maxValue) * 100 : 0;
                    return (
                        <div
                            key={data.month}
                            className="flex flex-col items-center gap-1 flex-1"
                        >
                            <span className="text-caption-12M text-primary-blue-500">
                                {data.value}
                            </span>
                            <div className="w-full flex justify-center">
                                <div
                                    className="w-8 bg-primary-blue-300 rounded-t-md transition-all duration-300"
                                    style={{ height: `${heightPercent}%`, minHeight: "4px" }}
                                />
                            </div>
                            <span className="text-caption-12M text-base-400 mt-1">
                                {data.month}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 pt-3 border-t border-base-200 flex items-center justify-between">
                <span className="text-caption-12M text-base-400">단위: kg CO₂</span>
                <span className="text-caption-12M text-primary-blue-500">
                    총 {monthlyData.reduce((sum, d) => sum + d.value, 0).toFixed(1)} kg 절감
                </span>
            </div>
        </section>
    );
};

export default CarbonGraph;
