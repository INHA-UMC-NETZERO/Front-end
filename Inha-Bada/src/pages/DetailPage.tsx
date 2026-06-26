import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getFeedId } from "../apis/feed";
import type { FeedControllerGetResponse } from "../types/feed";

const DetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<FeedControllerGetResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await getFeedId(Number(id));
                setItem(data);
            } catch (err) {
                console.error("상세 정보 불러오기 실패:", err);
                setError("게시물을 불러올 수 없습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (isLoading) {
        return (
            <main className="w-full flex items-center justify-center h-full">
                <Loader2 size={32} className="animate-spin text-primary-blue-500" />
            </main>
        );
    }

    if (error || !item) {
        return (
            <main className="w-full flex flex-col items-center justify-center h-full gap-4">
                <p className="text-body-14R text-base-500">{error || "게시물을 찾을 수 없습니다."}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded-xl text-body-14M text-white bg-primary-blue-500 hover:bg-primary-blue-600 transition-colors"
                >
                    돌아가기
                </button>
            </main>
        );
    }

    return (
        <main className="w-full">
            {/* 상단 네비게이션 */}
            <div className="flex items-center gap-3 p-4 border-b border-base-300">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 rounded-full hover:bg-base-200 transition-colors"
                >
                    <ArrowLeft size={24} className="text-base-700" />
                </button>
                <h1 className="text-heading-18B text-base-800">상품 상세</h1>
            </div>

            {/* 제품 이미지 */}
            <div className="w-full h-72 bg-gray-background">
                {item.imageUrls.length > 0 ? (
                    <img
                        src={item.imageUrls[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-body-14R text-base-400">이미지 없음</p>
                    </div>
                )}
            </div>

            {/* 상품 정보 */}
            <div className="p-6 flex flex-col gap-4">
                {/* 카테고리 태그 */}
                {item.category && (
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                            {item.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-caption-12M ${
                            item.closed
                                ? "bg-base-200 text-base-500"
                                : "bg-green-100 text-green-700"
                        }`}>
                            {item.closed ? "마감" : "나눔중"}
                        </span>
                    </div>
                )}

                {/* 제품명 */}
                <h2 className="text-heading-24B text-base-900">{item.title}</h2>

                {/* 등록자 & 수량 */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-caption-12M text-base-400">등록자</span>
                        <span className="text-body-14M text-base-700">{item.giverName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-caption-12M text-base-400">잔여 수량</span>
                        <span className="text-body-14M text-base-700">
                            {item.remainingQuantity} / {item.totalQuantity}개
                        </span>
                    </div>
                </div>

                {/* 수령 시간 */}
                {item.slots.length > 0 && (
                    <div>
                        <h3 className="text-body-14B text-base-700 mb-2">수령 가능 시간</h3>
                        <div className="flex flex-col gap-1">
                            {item.slots.map((slot) => (
                                <p key={slot.id} className="text-caption-12R text-base-500">
                                    {new Date(slot.startTime).toLocaleString("ko-KR")} ~ {new Date(slot.endTime).toLocaleString("ko-KR")}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* 구분선 */}
                <hr className="border-base-200" />

                {/* 상품 설명 */}
                <div>
                    <h3 className="text-body-16B text-base-800 mb-2">상품 설명</h3>
                    <p className="text-body-14R text-base-600 leading-relaxed whitespace-pre-wrap">
                        {item.description}
                    </p>
                </div>

                {/* 신청 버튼 */}
                <button
                    disabled={item.closed}
                    className="w-full py-3 mt-4 rounded-xl text-body-16SB text-white bg-primary-blue-500 hover:bg-primary-blue-600 disabled:bg-base-300 disabled:cursor-not-allowed transition-colors"
                >
                    {item.closed ? "마감된 게시물입니다" : "신청하기"}
                </button>
            </div>
        </main>
    );
};

export default DetailPage;
