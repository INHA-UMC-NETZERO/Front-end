import { useEffect, useState } from "react";
import { Leaf, Package, CheckCircle, ArrowLeft, Recycle, TreePine, Gift, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserPosts, getUser } from "../apis/user";
import { patchPostsApprove, patchPostsReject, patchPostsComplete } from "../apis/request";
import { postLogout } from "../apis/auth";
import { logout } from "../utils/auth";
import type { UserPost, UserRequest } from "../types/user";

const monthlyData = [
    { month: "1월", value: 1.2 },
    { month: "2월", value: 2.5 },
    { month: "3월", value: 1.8 },
    { month: "4월", value: 3.4 },
    { month: "5월", value: 4.1 },
    { month: "6월", value: 6.7 },
];

const MonthlyChart = () => {
    const maxValue = Math.max(...monthlyData.map((d) => d.value));
    return (
        <div className="flex items-end justify-between gap-1 h-32">
            {monthlyData.map((data) => {
                const heightPercent = maxValue > 0 ? (data.value / maxValue) * 100 : 0;
                return (
                    <div key={data.month} className="flex flex-col items-center gap-0.5 flex-1">
                        <span className="text-[10px] text-primary-blue-500">{data.value}</span>
                        <div className="w-full flex justify-center">
                            <div
                                className="w-5 bg-primary-blue-300 rounded-t-sm"
                                style={{ height: `${heightPercent}%`, minHeight: "3px" }}
                            />
                        </div>
                        <span className="text-[10px] text-base-400">{data.month}</span>
                    </div>
                );
            })}
        </div>
    );
};

const MyPage = () => {
    const navigate = useNavigate();
    const [myPosts, setMyPosts] = useState<UserPost[]>([]);
    const [myRequests, setMyRequests] = useState<UserRequest[]>([]);
    const [activeTab, setActiveTab] = useState<"registered" | "reserved">("registered");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const PAGE_SIZE = 10;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [posts, requests] = await Promise.all([
                    getUserPosts(),
                    getUser(),
                ]);
                setMyPosts(posts);
                setMyRequests(requests);
            } catch (error) {
                console.error("마이페이지 데이터 불러오기 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApprove = async (requestId: number) => {
        try {
            await patchPostsApprove(requestId);
            setMyPosts((prev) =>
                prev.map((post) => ({
                    ...post,
                    requests: post.requests.map((req) =>
                        req.requestId === requestId ? { ...req, status: "APPROVED" as const } : req
                    ),
                }))
            );
        } catch (error) {
            console.error("승인 실패:", error);
            alert("승인에 실패했습니다.");
        }
    };

    const handleReject = async (requestId: number) => {
        try {
            await patchPostsReject(requestId);
            setMyPosts((prev) =>
                prev.map((post) => ({
                    ...post,
                    requests: post.requests.map((req) =>
                        req.requestId === requestId ? { ...req, status: "REJECTED" as const } : req
                    ),
                }))
            );
        } catch (error) {
            console.error("거절 실패:", error);
            alert("거절에 실패했습니다.");
        }
    };

    const handleComplete = async (requestId: number) => {
        try {
            await patchPostsComplete(requestId);
            setMyPosts((prev) =>
                prev.map((post) => ({
                    ...post,
                    requests: post.requests.map((req) =>
                        req.requestId === requestId ? { ...req, status: "COMPLETED" as const } : req
                    ),
                }))
            );
        } catch (error) {
            console.error("전달 완료 실패:", error);
            alert("전달 완료에 실패했습니다.");
        }
    };

    const handleLogoutClick = async () => {
        try {
            await postLogout();
        } catch (error) {
            console.error("로그아웃 실패:", error);
        } finally {
            logout();
            navigate("/login");
        }
    };

    const normalizeStatus = (status: string) => {
        const s = (status || "").toUpperCase().trim();
        switch (status) {
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
                return s;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (normalizeStatus(status)) {
            case "PENDING":
                return "bg-base-200 text-base-500";
            case "APPROVED":
                return "bg-yellow-100 text-yellow-700";
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "REJECTED":
                return "bg-red-100 text-red-600";
            default:
                return "bg-base-200 text-base-500";
        }
    };

    const getStatusText = (status: string) => {
        switch (normalizeStatus(status)) {
            case "PENDING":
                return "신청 중";
            case "APPROVED":
                return "예약중";
            case "COMPLETED":
                return "전달완료";
            case "REJECTED":
                return "거절됨";
            default:
                return status;
        }
    };

    const completedCount = myPosts.reduce(
        (sum, post) => sum + post.requests.filter((r) => normalizeStatus(r.status) === "COMPLETED").length,
        0
    );
    const totalCarbonSaved = completedCount * 2.5; // 건당 약 2.5kg 추정

    // 게시물의 상태 우선순위 계산
    // 1: 예약중(APPROVED 요청 존재) > 2: 예약 신청(PENDING) > 3: 일반(요청 없음) > 4: 전달완료(COMPLETED) > 5: 거절됨(REJECTED)
    const getPostPriority = (post: UserPost) => {
        const statuses = (post.requests || []).map((r) => normalizeStatus(r.status));
        if (statuses.includes("APPROVED")) return 1;
        if (statuses.includes("PENDING")) return 2;
        if (statuses.length === 0) return 3;
        if (statuses.includes("COMPLETED")) return 4;
        if (statuses.includes("REJECTED")) return 5;
        return 3;
    };

    const sortedPosts = [...myPosts].sort((a, b) => {
        const pa = getPostPriority(a);
        const pb = getPostPriority(b);
        if (pa !== pb) return pa - pb;
        // 같은 상태면 최신순 (createdAt desc)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE);
    const pagedPosts = sortedPosts.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

    if (isLoading) {
        return (
            <main className="w-full flex items-center justify-center h-full">
                <p className="text-body-14R text-base-400">불러오는 중...</p>
            </main>
        );
    }

    return (
        <main className="w-full">
            {/* 상단 */}
            <div className="flex items-center gap-3 p-4 border-b border-base-300">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 rounded-full hover:bg-base-200 transition-colors"
                >
                    <ArrowLeft size={24} className="text-base-700" />
                </button>
                <h1 className="text-heading-18B text-base-800">마이페이지</h1>
            </div>

            <div className="p-4 flex flex-col gap-6">
                <div className="flex gap-4">
                {/* 탄소중립 지표 */}
                <section className="flex-[2] bg-white border border-base-300 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Leaf size={20} className="text-green-600" />
                        <h2 className="text-body-16B text-base-800">탄소중립 대시보드</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* 2x2 지표 카드 */}
                        <div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                                    <Recycle size={18} className="text-green-500 mb-1" />
                                    <span className="text-heading-18B text-green-700">{totalCarbonSaved.toFixed(1)}</span>
                                    <span className="text-caption-12M text-green-500 mt-1">kg CO₂ 절감</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                                    <TreePine size={18} className="text-green-500 mb-1" />
                                    <span className="text-heading-18B text-green-700">{(totalCarbonSaved / 22).toFixed(1)}</span>
                                    <span className="text-caption-12M text-green-500 mt-1">나무 환산 (그루)</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                                    <Gift size={18} className="text-green-500 mb-1" />
                                    <span className="text-heading-18B text-green-700">{myPosts.length}</span>
                                    <span className="text-caption-12M text-green-500 mt-1">나눔 횟수</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                                    <Package size={18} className="text-green-500 mb-1" />
                                    <span className="text-heading-18B text-green-700">{myRequests.length}</span>
                                    <span className="text-caption-12M text-green-500 mt-1">나눔 받은 횟수</span>
                                </div>
                            </div>

                            {/* 게이지 바 */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-caption-12M text-base-500">전달 완료율</span>
                                    <span className="text-caption-12B text-green-600">
                                        {myPosts.length > 0 ? Math.round((completedCount / myPosts.length) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${myPosts.length > 0 ? (completedCount / myPosts.length) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex-1 bg-white border border-base-300 rounded-2xl p-5 flex flex-col">
                    {/* 월별 탄소 절감량 */}
                    <h2 className="text-body-16B text-base-800 flex items-center gap-1.5">
                        <TrendingDown size={18} className="text-primary-blue-500" />
                        월별 탄소 절감량
                    </h2>
                    <div className="flex-1 flex flex-col justify-end">
                        <MonthlyChart />
                        <div className="mt-3 pt-3 border-t border-base-200 flex items-center justify-between">
                            <span className="text-caption-12M text-base-400">최근 6개월 동안</span>
                            <span className="text-caption-12B text-primary-blue-500">
                                총 {monthlyData.reduce((sum, d) => sum + d.value, 0).toFixed(1)} kg 절감
                            </span>
                        </div>
                    </div>
                </section>
                </div>

                {/* 탭 */}
                <section>
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab("registered")}
                            className={`flex items-center justify-center gap-1.5 p-4 w-40 h-8 rounded-xl text-body-14B transition-colors ${
                                activeTab === "registered"
                                    ? "bg-primary-blue-500 text-white"
                                    : "bg-white text-base-500 border border-base-300"
                            }`}
                        >
                            <Package size={16} />
                            내가 등록한 물품
                        </button>
                        <button
                            onClick={() => setActiveTab("reserved")}
                            className={`flex items-center justify-center gap-1.5 p-4 w-40 h-8 rounded-xl text-body-14B transition-colors ${
                                activeTab === "reserved"
                                    ? "bg-primary-blue-500 text-white"
                                    : "bg-white text-base-500 border border-base-300"
                            }`}
                        >
                            <CheckCircle size={16} />
                            내가 신청한 물품
                        </button>
                    </div>

                    {/* 내가 등록한 물품 */}
                    {activeTab === "registered" && (
                        <div>
                            <div className="flex flex-col gap-3">
                                {sortedPosts.length === 0 ? (
                                    <div className="py-12 text-center text-body-14R text-base-400">등록한 물품이 없습니다.</div>
                                ) : (
                                    pagedPosts.map((post) => (
                                    <div key={post.postId} className="p-4 bg-white border border-base-300 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-body-14B text-base-800 truncate">{post.title}</p>
                                            <span className="px-2 py-0.5 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                                                {post.category}
                                            </span>
                                        </div>
                                        <p className="text-caption-12R text-base-400 mb-3">
                                            잔여 {post.remainingQuantity} / {post.totalQuantity}개
                                        </p>

                                        {/* 신청 요청 목록 */}
                                        {post.requests && post.requests.length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {post.requests.map((req) => {
                                                    const status = normalizeStatus(req.status);
                                                    const rowColor =
                                                        status === "APPROVED"
                                                            ? "bg-yellow-50 border border-yellow-200"
                                                            : status === "REJECTED"
                                                            ? "bg-red-50 border border-red-200"
                                                            : status === "COMPLETED"
                                                            ? "bg-green-50 border border-green-200"
                                                            : "bg-base-100 border border-base-200";
                                                    return (
                                                    <div key={req.requestId} className={`flex items-center justify-between p-3 rounded-lg ${rowColor}`}>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-caption-12M text-base-700">{req.receiverName}</span>
                                                            <span className="text-caption-12R text-base-400">{req.quantity}개</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-caption-12M ${getStatusBadge(req.status)}`}>
                                                                {getStatusText(req.status)}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {status === "PENDING" && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleApprove(req.requestId)}
                                                                        className="px-3 py-1 rounded-lg text-caption-12M text-white bg-primary-blue-500 hover:bg-primary-blue-600 transition-colors"
                                                                    >
                                                                        승인
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleReject(req.requestId)}
                                                                        className="px-3 py-1 rounded-lg text-caption-12M text-base-500 border border-base-300 hover:bg-base-200 transition-colors"
                                                                    >
                                                                        거절
                                                                    </button>
                                                                </>
                                                            )}
                                                            {status === "APPROVED" && (
                                                                <button
                                                                    onClick={() => handleComplete(req.requestId)}
                                                                    className="px-3 py-1 rounded-lg text-caption-12M text-white bg-green-500 hover:bg-green-600 transition-colors"
                                                                >
                                                                    전달 완료하기
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-caption-12R text-base-400">아직 신청이 없습니다.</p>
                                        )}
                                    </div>
                                ))
                            )}
                            </div>

                            {/* 페이지네이션 */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-3">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                        disabled={currentPage === 0}
                                        className="px-3 py-1 rounded-lg text-caption-12M border border-base-300 text-base-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-base-100 transition-colors"
                                    >
                                        이전
                                    </button>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i)}
                                            className={`w-8 h-8 rounded-lg text-caption-12M transition-colors ${
                                                currentPage === i
                                                    ? "bg-primary-blue-500 text-white"
                                                    : "bg-white text-base-500 border border-base-300 hover:bg-base-100"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                                        disabled={currentPage === totalPages - 1}
                                        className="px-3 py-1 rounded-lg text-caption-12M border border-base-300 text-base-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-base-100 transition-colors"
                                    >
                                        다음
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === "reserved" && (
                        <div className="flex flex-col gap-3">
                            {myRequests.length === 0 ? (
                                <div className="py-12 text-center text-body-14R text-base-400">신청한 물품이 없습니다.</div>
                            ) : (
                                myRequests.map((req) => {
                                    const isReserved = normalizeStatus(req.status) === "APPROVED";
                                    return (
                                    <div
                                        key={req.requestId}
                                        className={`flex items-center justify-between p-4 border rounded-xl ${
                                            isReserved
                                                ? "bg-yellow-50 border-yellow-300"
                                                : "bg-white border-base-300"
                                        }`}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <p className="text-body-14B text-base-800">{req.postTitle}</p>
                                            <p className="text-caption-12R text-base-400">{req.quantity}개</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-caption-12M ${getStatusBadge(req.status)}`}>
                                            {getStatusText(req.status)}
                                        </span>
                                    </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </section>

                {/* 로그아웃 */}
                <div className="flex">
                    <button
                        onClick={handleLogoutClick}
                        className="flex p-4 items-center justify-center w-20 h-8 rounded-lg text-caption-12B bg-primary-blue-500 text-base-100 hover:bg-primary-blue-600 transition-colors"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </main>
    );
};

export default MyPage;
