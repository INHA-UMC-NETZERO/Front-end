import { useState, useRef, useEffect } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";

const categories: Record<string, string[]> = {
    "전체": [],
    "식품": ["컵라면", "과자", "사탕", "초콜릿", "젤리"],
    "음료": ["생수", "탄산음료", "이온음료", "커피"],
    "문구/행사": ["명찰", "네임택", "홍보용품"],
    "포장/정리": ["박스", "테이프", "보관함", "집게"],
    "가구/공간": ["의자", "테이블", "게시판", "선반"],
    "기타": ["기타"],
};

interface CategoryBarProps {
    selectedCategory: string | null;
    selectedSubCategory: string | null;
    onCategorySelect: (category: string, sub: string | null) => void;
}

const CategoryBar = ({
    selectedCategory,
    selectedSubCategory,
    onCategorySelect,
}: CategoryBarProps) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 시 드롭다운 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCategoryClick = (category: string) => {
        onCategorySelect(category, null);
    };

    const handleChevronClick = (category: string) => {
        setOpenDropdown((prev) => (prev === category ? null : category));
    };

    const handleSubCategoryClick = (category: string, sub: string) => {
        onCategorySelect(category, sub);
        setOpenDropdown(null);
    };

    return (
        <div className="py-4 border-b-1 border-base-300" ref={containerRef}>
            <div className="flex gap-2 overflow-visible items-center">
                {Object.entries(categories).map(([category, subs]) => (
                    <div key={category} className="relative shrink-0">
                        <div
                            className={`relative flex items-center ${
                                category.length <= 2 ? "justify-center pr-1" : "pl-3"
                            } w-22 h-8 rounded-full border transition-colors ${
                                selectedCategory === category
                                    ? "bg-primary-blue-500 text-white border-primary-blue-500"
                                    : "bg-white text-base-500 border-base-300"
                            }`}
                        >
                            <button
                                onClick={() => handleCategoryClick(category)}
                                className="text-caption-12M whitespace-nowrap"
                            >
                                {category}
                            </button>
                            {subs.length > 0 && (
                                <button
                                    onClick={() => handleChevronClick(category)}
                                    className="absolute right-2"
                                >
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-200 ${
                                            openDropdown === category ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                            )}
                        </div>

                        {/* 드롭다운 리스트 */}
                        {openDropdown === category && subs.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 w-36 bg-white border border-base-300 rounded-xl shadow-lg z-50 py-1">
                                {subs.map((sub) => (
                                    <button
                                        key={sub}
                                        onClick={() => handleSubCategoryClick(category, sub)}
                                        className={`w-full text-left px-4 py-2.5 text-caption-12M transition-colors ${
                                            selectedCategory === category && selectedSubCategory === sub
                                                ? "bg-primary-blue-100 text-primary-blue-700"
                                                : "text-base-600 hover:bg-gray-background"
                                        }`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {/* 초기화 버튼 */}
                <button
                    onClick={() => onCategorySelect("", null)}
                    className="ml-auto shrink-0 flex items-center gap-2 w-20 px-3 h-8 rounded-full border border-base-300 text-caption-12M text-base-500 hover:border-primary-blue-300  hover:bg-primary-blue-100 transition-colors"
                >
                    <RotateCcw size={12} />
                    초기화
                </button>
            </div>
        </div>
    );
};

export default CategoryBar;
