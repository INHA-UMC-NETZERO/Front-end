import { useState } from "react";
import { Leaf, Package, CheckCircle, ArrowLeft, Recycle, TreePine, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ItemStatus = "예약중" | "전달완료";

interface MyItem {
    id: number;
    title: string;
    category: string;
    subCategory: string;
    quantity: number;
    status: ItemStatus;
    carbonSaved: number; // kg CO₂
    type: "registered" | "reserved";
}

const dummyItems: MyItem[] = [
    { id: 1, title: "컵라면 20개입", category: "식품", subCategory: "컵라면", quantity: 20, status: "예약중", carbonSaved: 2.4, type: "registered" },
    { id: 2, title: "A4 용지 박스", category: "문구/행사", subCategory: "홍보용품", quantity: 5, status: "예약중", carbonSaved: 1.8, type: "registered" },
    { id: 3, title: "접이식 의자", category: "가구/공간", subCategory: "의자", quantity: 3, status: "전달완료", carbonSaved: 5.2, type: "registered" },
    { id: 4, title: "생수 2L 12팩", category: "음료", subCategory: "생수", quantity: 12, status: "예약중", carbonSaved: 3.1, type: "reserved" },
    { id: 5, title: "포장 박스 (중)", category: "포장/정리", subCategory: "박스", quantity: 10, status: "전달완료", carbonSaved: 1.5, type: "reserved" },
];

const statusColor: Record<ItemStatus, string> = {
    "예약중": "bg-yellow-100 text-yellow-700",
    "전달완료": "bg-green-100 text-green-700",
};

const MyPage = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<MyItem[]>(dummyItems);
    const [activeTab, setActiveTab] = useState<"registered" | "reserved">("registered");

    const handleDeliveryComplete = (id: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, status: "전달완료" as ItemStatus } : item
            )
        );
    };

    const filteredItems = items.filter((item) => item.type === activeTab);
    const completedItems = items.filter((item) => item.status === "전달완료");
    const totalCarbonSaved = completedItems.reduce((sum, item) => sum + item.carbonSaved, 0);

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
                {/* 프로필 */}
                <section className="flex items-center gap-4">
                    <img
                        className="w-16 h-16 rounded-full object-cover"
                        alt="프로필"
                        src="https://mblogthumb-phinf.pstatic.net/MjAyMTAxMjRfMTE2/MDAxNjExNDczMDE4MTM3.6HwFNCasGUnAxBuzzvqbrSgn0zcZV7OLgtwbNjkEWl4g.pm3IAwO7J0T0KWDgAOqaXs_yS07XjLKUFdsIMGSbflEg.JPEG.binbe/bros_blank.jpg?type=w800"
                    />
                    <div className="flex flex-col gap-1">
                        <p className="text-body-16B text-base-800">닉네임</p>
                        <p className="text-caption-12R text-base-400">공과대학 컴퓨터공학과</p>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                                <Gift size={14} className="text-primary-blue-400" />
                                <span className="text-caption-12M text-base-600">나눔 8</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Package size={14} className="text-primary-blue-400" />
                                <span className="text-caption-12M text-base-600">받음 3</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 탄소중립 지표 */}
                <section className="bg-white border border-base-300 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Leaf size={20} className="text-green-600" />
                        <h2 className="text-body-16B text-base-800">탄소중립 대시보드</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                            <Recycle size={20} className="text-green-500 mb-1" />
                            <span className="text-heading-20B text-green-700">
                                {totalCarbonSaved.toFixed(1)}
                            </span>
                            <span className="text-caption-12M text-green-500 mt-1">
                                kg CO₂ 절감
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                            <TreePine size={20} className="text-green-500 mb-1" />
                            <span className="text-heading-20B text-green-700">
                                {(totalCarbonSaved / 22).toFixed(1)}
                            </span>
                            <span className="text-caption-12M text-green-500 mt-1">
                                나무 환산 (그루)
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                            <Leaf size={20} className="text-green-500 mb-1" />
                            <span className="text-heading-20B text-green-700">
                                {completedItems.length}
                            </span>
                            <span className="text-caption-12M text-green-500 mt-1">
                                전달 완료
                            </span>
                        </div>
                    </div>

                    {/* 진행 바 */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-caption-12M text-base-500">전달 완료율</span>
                            <span className="text-caption-12M text-green-600">
                                {items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 0}%
                            </span>
                        </div>
                        <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-300"
                                style={{
                                    width: `${items.length > 0 ? (completedItems.length / items.length) * 100 : 0}%`,
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* 나눔/예약 현황 탭 */}
                <section>
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab("registered")}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-body-14M transition-colors ${
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
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-body-14M transition-colors ${
                                activeTab === "reserved"
                                    ? "bg-primary-blue-500 text-white"
                                    : "bg-white text-base-500 border border-base-300"
                            }`}
                        >
                            <CheckCircle size={16} />
                            내가 예약한 물품
                        </button>
                    </div>

                    {/* 물품 리스트 */}
                    <div className="flex flex-col gap-3">
                        {filteredItems.length === 0 ? (
                            <div className="py-12 text-center text-body-14R text-base-400">
                                표시할 물품이 없습니다.
                            </div>
                        ) : (
                            filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 bg-white border border-base-300 rounded-xl"
                                >
                                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-body-14B text-base-800 truncate">
                                                {item.title}
                                            </p>
                                            <span className={`px-2 py-0.5 rounded-full text-caption-12M ${statusColor[item.status]}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="px-2 py-0.5 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                                                {item.category}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                                                {item.subCategory}
                                            </span>
                                            <span className="text-caption-12R text-base-400 ml-1">
                                                {item.quantity}개
                                            </span>
                                        </div>
                                        {item.status === "전달완료" && (
                                            <p className="text-caption-12M text-primary-blue-400 flex items-center gap-1 mt-1">
                                                <Leaf size={12} />
                                                {item.carbonSaved} kg CO₂ 절감
                                            </p>
                                        )}
                                    </div>

                                    {/* 전달완료 버튼 */}
                                    {activeTab === "registered" && item.status !== "전달완료" && (
                                        <button
                                            onClick={() => handleDeliveryComplete(item.id)}
                                            className="ml-3 shrink-0 px-4 py-2 rounded-xl text-caption-12M text-white bg-primary-blue-600 hover:bg-primary-blue-700 transition-colors"
                                        >
                                            전달 완료
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default MyPage;
