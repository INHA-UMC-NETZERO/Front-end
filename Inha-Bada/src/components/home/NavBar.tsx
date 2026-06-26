import { useState } from "react";
import CategorySetting from "./CategorySetting";
import CategoryBar from "./CategoryBar";
import SearchBar from "./SearchBar";

interface NavBarProps {
    sortOrder: "latest" | "oldest";
    onSortChange: (sort: "latest" | "oldest") => void;
    onSearch: (keyword: string) => void;
    onCategoryChange: (category: string, subCategory: string) => void;
}

const NavBar = ({ sortOrder, onSortChange, onSearch, onCategoryChange }: NavBarProps) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

    const handleCategoryToggle = () => {
        setIsCategoryOpen((prev) => !prev);
    };

    const handleCategorySelect = (category: string, sub: string | null) => {
        setSelectedCategory(category || null);
        setSelectedSubCategory(sub);
        // "전체" 또는 빈 값이면 필터 해제
        const cat = category === "전체" ? "" : category || "";
        onCategoryChange(cat, sub || "");
    };

    return (
        <nav className="flex flex-col">
            <div className="flex flex-1 items-center justify-between border-b-1 border-base-300 pb-4">
                <CategorySetting
                    isOpen={isCategoryOpen}
                    onToggle={handleCategoryToggle}
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                />
                <div className="flex gap-2 items-center">
                    <SearchBar onSearch={onSearch} />
                    <button
                        onClick={() => onSortChange("latest")}
                        className={`px-3 py-2 w-18 rounded-lg text-caption-12M transition-colors ${
                            sortOrder === "latest"
                                ? "bg-primary-blue-500 text-white"
                                : "bg-white text-base-500 border border-base-300"
                        }`}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => onSortChange("oldest")}
                        className={`px-3 py-2 w-18 rounded-lg text-caption-12M transition-colors ${
                            sortOrder === "oldest"
                                ? "bg-primary-blue-500 text-white"
                                : "bg-white text-base-500 border border-base-300"
                        }`}
                    >
                        오래된순
                    </button>
                </div>
            </div>
            {isCategoryOpen && (
                <CategoryBar
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                    onCategorySelect={handleCategorySelect}
                />
            )}
        </nav>
    );
};

export default NavBar;
