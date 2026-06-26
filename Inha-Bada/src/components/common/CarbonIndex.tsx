import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import { getUserPosts } from "../../apis/user";
import { isLoggedIn } from "../../utils/auth";

const normalizeStatus = (status: string) => {
    switch ((status || "").trim()) {
        case "신청중":
        case "신청 중":
        case "대기중":
        case "대기":
            return "PENDING";
        case "예약중":
        case "승인":
        case "승인됨":
            return "APPROVED";
        case "거절됨":
        case "거절":
            return "REJECTED";
        case "전달완료":
        case "완료":
            return "COMPLETED";
        default:
            return (status || "").toUpperCase().trim();
    }
};

const CarbonIndex = () => {
    const [completedCount, setCompletedCount] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);

    useEffect(() => {
        if (!isLoggedIn()) return;
        const fetchData = async () => {
            try {
                const posts = await getUserPosts();
                setTotalPosts(posts.length);
                const completed = posts.reduce(
                    (sum, post) => sum + post.requests.filter((r) => normalizeStatus(r.status) === "COMPLETED").length,
                    0
                );
                setCompletedCount(completed);
            } catch (error) {
                console.error("탄소 지표 불러오기 실패:", error);
            }
        };
        fetchData();
    }, []);

    const totalCarbonSaved = completedCount * 2.5;
    const goalPercent = totalPosts > 0 ? Math.min(Math.round((completedCount / totalPosts) * 100), 100) : 0;

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
                        {totalCarbonSaved.toFixed(1)} kg
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
                    style={{ width: `${goalPercent}%` }}
                />
            </div>
            <p className="text-caption-12M text-base-400">
                전달 완료율 {goalPercent}%
            </p>
        </div>
    );
};

export default CarbonIndex;
