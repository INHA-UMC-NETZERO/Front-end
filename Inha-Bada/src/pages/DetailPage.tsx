import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // TODO: id를 사용해 실제 API에서 상품 데이터를 가져오기
    // 현재는 더미 데이터 표시
    const item = {
        id: Number(id),
        title: `상품 ${Number(id) + 1}`,
        image: "",
        organization: "인하대 학생회",
        quantity: 5,
        category: "식품",
        subCategory: "과자",
        description:
            "상품에 대한 상세 설명이 여기에 표시됩니다. 실제 API 연동 시 서버에서 받아온 데이터로 대체됩니다.",
    };

    return (
        <main className="w-full">
            {/* 상단 네비게이션 */}
            <div className="flex items-center gap-3 p-4 border-b border-base-300">
                <button
                    onClick={() => navigate(-1)}
                    className="p-1 rounded-full hover:bg-blue-300 transition-colors"
                >
                    <ArrowLeft size={24} className="text-base-700" />
                </button>
                <h1 className="text-heading-18B text-base-800">상품 상세</h1>
            </div>

            {/* 제품 이미지 */}
            <div className="p-10 w-full h-80 bg-gray-background">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-body-14R text-base-400">
                            이미지 없음
                        </p>
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
                        {item.subCategory && (
                            <span className="px-3 py-1 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                                {item.subCategory}
                            </span>
                        )}
                    </div>
                )}

                {/* 제품명 */}
                <h2 className="text-heading-24B text-base-900">
                    {item.title}
                </h2>

                {/* 등록 단체 & 수량 */}
                <div className="flex items-center gap-4">
                    {item.organization && (
                        <div className="flex items-center gap-2">
                            <span className="text-caption-12M text-base-400">
                                등록 단체
                            </span>
                            <span className="text-body-14M text-base-700">
                                {item.organization}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-caption-12M text-base-400">
                            수량
                        </span>
                        <span className="text-body-14M text-base-700">
                            {item.quantity}개
                        </span>
                    </div>
                </div>

                {/* 구분선 */}
                <hr className="border-base-200" />

                {/* 상품 설명 */}
                <div>
                    <h3 className="text-body-16B text-base-800 mb-2">
                        상품 설명
                    </h3>
                    <p className="text-body-14R text-base-600 leading-relaxed">
                        {item.description}
                    </p>
                </div>

                {/* 신청 버튼 */}
                <button className="w-full py-3 mt-4 rounded-xl text-body-16SB text-white bg-primary-blue-500 hover:bg-primary-blue-600 transition-colors">
                    신청하기
                </button>
            </div>
        </main>
    );
};

export default DetailPage;
