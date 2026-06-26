import { useNavigate } from "react-router-dom";

interface ItemCardProps {
    id: number;
    title: string;
    image?: string;
    organization?: string;
    quantity?: number;
    category?: string;
    subCategory?: string;
    description?: string;
}

const ItemCard = ({
    id,
    title,
    image,
    organization,
    quantity,
    category,
    subCategory,
    description,
}: ItemCardProps) => {
    const navigate = useNavigate();

    return (
        <section
            onClick={() => navigate(`/detail/${id}`)}
            className="flex flex-col border-1 border-base-300 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        >
            {/* 제품 사진 */}
            <div className="w-full h-40 bg-gray-background">
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="p-3 flex flex-col gap-1">
                {/* 제품명 */}
                <p className="text-body-14B text-base-700 truncate">{title}</p>

                {/* 등록 단체 · 수량 */}
                {(organization || quantity !== undefined) && (
                    <p className="text-caption-12R text-base-400 truncate">
                        {organization}
                        {organization && quantity !== undefined && (
                            <span className="mx-1">·</span>
                        )}
                        {quantity !== undefined && `${quantity}개`}
                    </p>
                )}

                {/* 카테고리 - 하위 카테고리 */}
                {category && (
                    <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                            {category}
                        </span>
                        {subCategory && (
                            <span className="px-2 py-0.5 rounded-full bg-primary-blue-100 text-caption-12M text-primary-blue-700">
                                {subCategory}
                            </span>
                        )}
                    </div>
                )}

                {/* 제품 설명 */}
                {description && (
                    <p className="text-caption-12R text-base-500 line-clamp-2 mt-1">
                        {description}
                    </p>
                )}

                {/* 신청하기 버튼 */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="w-full h-10 py-2 mt-2 rounded-lg text-body-14M text-white bg-primary-blue-500 hover:bg-primary-blue-600 transition-colors"
                >
                    신청하기
                </button>
            </div>
        </section>
    );
};

export default ItemCard;
