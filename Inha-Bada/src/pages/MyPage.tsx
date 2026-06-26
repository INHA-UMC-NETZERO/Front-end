import { useEffect, useState } from "react";
import { Leaf, Package, CheckCircle, ArrowLeft, Recycle, TreePine, Gift, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyPageSummary, getMyPageRequests, getMyPagePosts } from "../apis/my-page";
import { patchPostsApprove, patchPostsReject, patchPostsComplete } from "../apis/request";
import { postLogout } from "../apis/auth";
import { logout } from "../utils/auth";
import { onDataRefresh, emitDataRefresh } from "../utils/events";
import type {
    MyPageSummaryResponse,
    MyPagePost,
    MyPageRequest,
    MonthlyCarbon,
} from "../types/my-page";

const gramToKg = (gram: number) => gram / 1000;

const MonthlyChart = ({ data }: { data: MonthlyCarbon[] }) => {
    if (!data || data.length === 0) {
        return (
            <p className="text-caption-12R text-base-400 py-8 text-center">
                데이터가 없습니다.
            </p>
        );
    }
    const maxValue = Math.max(...data.map((d) => d.carbonSavingGram), 1);
    const TRACK_HEIGHT = 100; // px

    return (
        <div className="flex items-end justify-between gap-1">
            {data.map((d) => {
                const heightPx = Math.max((d.carbonSavingGram / maxValue) * TRACK_HEIGHT, 3);
                const label = d.month.slice(5).replace(/^0/, "") + "월";
                return (
                    <div key={d.month} className="flex flex-col items-center gap-0.5 flex-1">
                        <span className="text-[10px] text-primary-blue-500">
                            {gramToKg(d.carbonSavingGram).toFixed(1)}
                        </span>
                        <div
                            className="w-5 bg-primary-blue-300 rounded-t-sm transition-all duration-500"
                            style={{ height: `${heightPx}px` }}
                        />
                        <span className="text-[10px] text-base-400">{label}</span>
                    </div>
                );
            })}
        </div>
    );
};

const MyPage = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<MyPageSummaryResponse | null>(null);
    const [myPosts, setMyPosts] = useState<MyPagePost[]>([]);
    const [myRequests, setMyRequests] = useState<MyPageRequest[]>([]);
    const [activeTab, setActiveTab] = useState<"registered" | "reserved">("registered");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const PAGE_SIZE = 10;

    useEffect(() => {
        fetchData();
        // 전역 새로고침 이벤트 구독 (다른 사람이 내 게시물에 신청 시 등 실시간 반영)
        const unsubscribe = onDataRefresh(() => {
            refreshData();
        });
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 주기적 폴링으로 새 신청 등 실시간 반영 (SSE 보조)
    useEffect(() => {
        const interval = setInterval(() => {
            refreshData();
        }, 15000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [summaryRes, posts, requests] = await Promise.all([
                getMyPageSummary(),
                getMyPagePosts(),
                getMyPageRequests(),
            ]);
            setSummary(summaryRes);
            setMyPosts(posts);
            setMyRequests(requests);
        } catch (error) {
            console.error("마이페이지 데이터 불러오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 탄소 지표/요약만 다시 불러와 실시간 반영 (전체 로딩 표시 없이)
    const refreshData = async () => {
        try {
            const [summaryRes, posts, requests] = await Promise.all([
                getMyPageSummary(),
                getMyPagePosts(),
                getMyPageRequests(),
            ]);
            setSummary(summaryRes);
            setMyPosts(posts);
            setMyRequests(requests);
        } catch (error) {
            console.error("마이페이지 갱신 실패:", error);
        }
    };

    const handleApprove = async (requestId: number) => {
        try {
            await patchPostsApprove(requestId);
            await refreshData();
            emitDataRefresh();
        } catch (error) {
            console.error("승인 실패:", error);
            alert("승인에 실패했습니다.");
        }
    };

    const handleReject = async (requestId: number) => {
        try {
            await patchPostsReject(requestId);
            await refreshData();
            emitDataRefresh();
        } catch (error) {
            console.error("거절 실패:", error);
            alert("거절에 실패했습니다.");
        }
    };

    const handleComplete = async (requestId: number) => {
        try {
            await patchPostsComplete(requestId);
            await refreshData();
            emitDataRefresh();
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

    // 활동/탄소 요약 (서버 데이터 우선, 없으면 0)
    const activity = summary?.activity;
    const totalCarbonKg = gramToKg(summary?.carbon.totalCarbonSavingGram ?? 0);
    const sharedCount = activity?.sharedCount ?? myPosts.length;
    const receivedCount = activity?.receivedCount ?? myRequests.length;
    const completedDeliveryCount = activity?.completedDeliveryCount ?? 0;
    const deliveryCompletionRate = activity?.deliveryCompletionRate ?? 0;
    const monthlyCarbon = summary?.monthlyCarbon ?? [];
    const totalMonthlyKg = gramToKg(
        monthlyCarbon.reduce((sum, d) => sum + d.carbonSavingGram, 0)
    );

    // 게시물 상태 우선순위: 예약중 > 예약신청 > 일반 > 전달완료 > 거절됨
    const getPostPriority = (post: MyPagePost) => {
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
                        <div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                                    <Recycle size={18} className="text-green-500 mb-1" />
                                    <span className="text-heading-18B text-green-700">{totalCarbonKg.toFixed(1)}</span>
                                    <span className="text-caption-12M text-green-500 mt-1">kg CO₂ 절감</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                                    <TreePine size={18} className="text-green-500 mb-1" />
                                    <span className="text-heading-18B text-green-700">{(totalCarbonKg / 22).toFixed(1)}</span>
                                    <span className="text-caption-12M text-green-500 mt-1">나무 환산 (그루)</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                                    <Gift size={18} className="text-green-500 mb-1" />
                                    <span className="text-heading-18B text-green-700">{sharedCount}</span>
                                    <span className="text-caption-12M text-green-500 mt-1">나눔 횟수</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                                    <Package size={18} className="text-green-500 mb-1" />
                                    <span className="text-heading-18B text-green-700">{receivedCount}</span>
                                    <span className="text-caption-12M text-green-500 mt-1">나눔 받은 횟수</span>
                                </div>
                            </div>

                            {/* 게이지 바 */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-caption-12M text-base-500">전달 완료율</span>
                                    <span className="text-caption-12B text-green-600">
                                        {deliveryCompletionRate}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                                        style={{ width: `${deliveryCompletionRate}%` }}
                                    />
                                </div>
                                <p className="text-caption-12R text-base-400 mt-1">
                                    전달 완료 {completedDeliveryCount}건
                                </p>
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
                        <MonthlyChart data={monthlyCarbon} />
                        <div className="mt-3 pt-3 border-t border-base-200 flex items-center justify-between">
                            <span className="text-caption-12M text-base-400">최근 6개월 동안</span>
                            <span className="text-caption-12B text-primary-blue-500">
                                총 {totalMonthlyKg.toFixed(1)} kg 절감
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
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                                                    {post.category}
                                                </span>
                                                {post.subCategory && (
                                                    <span className="px-2 py-0.5 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                                                        {post.subCategory}
                                                    </span>
                                                )}
                                            </div>
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

                    {/* 내가 신청한 물품 */}
                    {activeTab === "reserved" && (
                        <div className="flex flex-col gap-3">
                            {myRequests.length === 0 ? (
                                <div className="py-12 text-center text-body-14R text-base-400">신청한 물품이 없습니다.</div>
                            ) : (
                                myRequests.map((req) => {
                                    return (
                                    <div
                                        key={req.requestId}
                                        className="flex items-center justify-between p-4 border rounded-xl bg-white border-base-300"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <p className="text-body-14B text-base-800">{req.postTitle}</p>
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                                                    {req.postCategory}
                                                </span>
                                                {req.postSubCategory && (
                                                    <span className="px-2 py-0.5 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                                                        {req.postSubCategory}
                                                    </span>
                                                )}
                                                <span className="text-caption-12R text-base-400 ml-1">{req.quantity}개</span>
                                                {normalizeStatus(req.status) === "COMPLETED" && req.carbonSavingGram != null && (
                                                    <span className="text-caption-12M text-green-600 flex items-center gap-1 ml-1">
                                                        <Leaf size={12} />
                                                        {gramToKg(req.carbonSavingGram).toFixed(1)} kg CO₂ 절감
                                                    </span>
                                                )}
                                            </div>
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
