import { Trophy } from "lucide-react";

interface RankingItem {
    rank: number;
    name: string;
    carbonSaved: number;
}

const dummyRanking: RankingItem[] = [
    { rank: 1, name: "인하대 학생회", carbonSaved: 45.2 },
    { rank: 2, name: "공과대학", carbonSaved: 32.8 },
    { rank: 3, name: "경영대학", carbonSaved: 28.5 },
    { rank: 4, name: "자연과학대학", carbonSaved: 21.3 },
    { rank: 5, name: "사회과학대학", carbonSaved: 15.7 },
];

const CarbonGraph = () => {
    return (
        <section className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-primary-blue-500" />
                <h2 className="text-body-14B text-base-800">월별 탄소 절감 랭킹</h2>
            </div>

            <div className="flex flex-col gap-2 flex-1">
                {dummyRanking.map((item) => (
                    <div
                        key={item.rank}
                        className="flex items-center justify-between py-2 rounded-lg hover:bg-gray-background transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={`text-body-14B w-5 text-center text-primary-blue-500`}
                            >
                                {item.rank}
                            </span>
                            <span className="text-caption-12B text-base-700">{item.name}</span>
                        </div>
                        <span className="text-caption-12B text-primary-blue-500">
                            {item.carbonSaved} kg
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CarbonGraph;
