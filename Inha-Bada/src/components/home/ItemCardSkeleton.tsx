const ItemCardSkeleton = () => {
    return (
        <div className="flex flex-col border-1 border-base-300 rounded-lg overflow-hidden animate-pulse">
            {/* 이미지 영역 */}
            <div className="w-full h-40 bg-base-200" />

            <div className="p-3 flex flex-col gap-2">
                {/* 제품명 */}
                <div className="h-4 bg-base-200 rounded w-3/4" />

                {/* 단체 · 수량 */}
                <div className="h-3 bg-base-200 rounded w-1/2" />

                {/* 카테고리 태그 */}
                <div className="flex gap-1.5">
                    <div className="h-5 w-12 bg-base-200 rounded-full" />
                    <div className="h-5 w-10 bg-base-200 rounded-full" />
                </div>

                {/* 버튼 */}
                <div className="h-10 bg-base-200 rounded-lg mt-2" />
            </div>
        </div>
    );
};

export default ItemCardSkeleton;
