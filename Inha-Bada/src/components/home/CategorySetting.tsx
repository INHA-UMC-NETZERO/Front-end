import { ChevronDown, ChevronUp } from "lucide-react";

interface CategorySettingProps {
    isOpen: boolean;
    onToggle: () => void;
    selectedCategory: string | null;
    selectedSubCategory: string | null;
}

const CategorySetting = ({
    isOpen,
    onToggle,
    selectedCategory,
    selectedSubCategory,
}: CategorySettingProps) => {
    const displayText = selectedCategory
        ? selectedSubCategory
            ? `${selectedCategory} - ${selectedSubCategory}`
            : selectedCategory
        : "카테고리 설정";

    return (
        <div className="p-2 px-4 h-[35.6px] flex bg-gray-100 border-1 border-base-300 rounded-full items-center justify-between text-center min-w-48">
            <p
                className={`text-center truncate ${
                    selectedCategory ? "text-blue-500 text-body-14B" : "text-body-14M text-base-300"
                }`}
            >
                {displayText}
            </p>
            <button onClick={onToggle}>
                {isOpen ? (
                    <ChevronUp size={20} className="text-base-400" />
                ) : (
                    <ChevronDown size={20} className="text-base-400" />
                )}
            </button>
        </div>
    );
};

export default CategorySetting;
