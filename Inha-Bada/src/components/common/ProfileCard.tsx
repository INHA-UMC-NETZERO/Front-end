import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Gift, Package } from "lucide-react";
import { getUserId, isLoggedIn } from "../../utils/auth";
import { getMyPageSummary } from "../../apis/my-page";
import { onDataRefresh } from "../../utils/events";

const ProfileCard = () => {
    const navigate = useNavigate();

    const loggedIn = isLoggedIn();
    const [nickname, setNickname] = useState(localStorage.getItem("userNickname") || "");
    const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
    const [givenCount, setGivenCount] = useState(0);
    const [receivedCount, setReceivedCount] = useState(0);

    useEffect(() => {
        if (!loggedIn) return;
        const fetchData = async () => {
            try {
                const summary = await getMyPageSummary();
                setNickname(summary.profile.nickname);
                setTotalCarbonSaved(summary.carbon.totalCarbonSavingGram / 1000);
                setGivenCount(summary.activity.sharedCount);
                setReceivedCount(summary.activity.receivedCount);
            } catch (error) {
                console.error("프로필 데이터 불러오기 실패:", error);
            }
        };
        fetchData();
        // 전역 새로고침 이벤트 구독 (실시간 갱신)
        const unsubscribe = onDataRefresh(fetchData);
        return unsubscribe;
    }, [loggedIn]);

    return (
        <div
            onClick={() => navigate(loggedIn ? "/user" : "/login")}
            className="flex flex-col gap-3 cursor-pointer hover:bg-primary-blue-100 transition-colors rounded-xl -m-4 p-4"
        >
            {/* 프로필 상단 */}
            <div className="flex items-center gap-3">
                <img
                    className="w-12 h-12 rounded-full object-cover"
                    alt="프로필"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkgQAbrZZwUaSnYFJhEsCN608RIC7qHYU4tu9w7b4rAOLmSwF1jRAoEnVg&s=10"
                />
                <div className="flex flex-col">
                    {loggedIn ? (
                        <>
                            <p className="text-body-14B text-base-800"> User {getUserId()}</p>
                            <p className="text-caption-12R text-base-400">{nickname || "소속 없음"}</p>
                        </>
                    ) : (
                        <p className="text-body-14B text-base-400">로그인 필요</p>
                    )}
                </div>
            </div>

            {/* 활동 요약 */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <Gift size={14} className="text-caption-12B text-primary-blue-500" />
                    <span className="text-caption-12M text-base-600">나눔 {givenCount}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Package size={14} className="text-caption-12B text-primary-blue-500" />
                    <span className="text-caption-12M text-base-600">받음 {receivedCount}</span>
                </div>
            </div>

            {/* 탄소 절감 */}
            <div className="flex items-center gap-1 px-2 py-1.5 bg-green-100 rounded-lg">
                <Leaf size={14} className="text-green-500" />
                <span className="text-caption-12M text-green-700">
                    총 {totalCarbonSaved.toFixed(1)}kg CO₂ 절감
                </span>
            </div>
        </div>
    );
};

export default ProfileCard;
