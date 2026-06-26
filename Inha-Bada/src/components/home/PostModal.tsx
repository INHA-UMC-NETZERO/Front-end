import { useState } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { postUploadFiles } from "../../apis/uploads";
import { postFeed } from "../../apis/post";
import type { CreatePostRequest } from "../../types/post";

interface PostModalProps {
    onClose: () => void;
}

const categories: Record<string, string[]> = {
    "식품": ["컵라면", "과자", "사탕", "초콜릿", "젤리"],
    "음료": ["생수", "탄산음료", "이온음료", "커피"],
    "문구/행사": ["명찰", "네임택", "홍보용품"],
    "포장/정리": ["박스", "테이프", "보관함", "집게"],
    "가구/공간": ["의자", "테이블", "게시판", "선반"],
    "기타": ["기타"],
};

const PostModal = ({ onClose }: PostModalProps) => {
    const [productName, setProductName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [pickupTime, setPickupTime] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageKey, setImageKey] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 미리보기 설정
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // 서버에 multipart/form-data로 업로드
        setIsUploading(true);
        try {
            const results = await postUploadFiles([file]);
            if (results.length > 0) {
                setImageKey(results[0].key);
            }
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
            alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
            setImagePreview(null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCategorySelect = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory("");
            setSelectedSubCategory("");
        } else {
            setSelectedCategory(category);
            setSelectedSubCategory("");
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setQuantity(value);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const requestData: CreatePostRequest = {
                title: productName,
                description,
                category: selectedCategory,
                subCategory: selectedSubCategory,
                imageKeys: imageKey ? [imageKey] : [],
                totalQuantity: Number(quantity),
                location,
                availableTime: pickupTime,
            };

            await postFeed(requestData);

            onClose();
        } catch (error) {
            console.error("게시글 등록 실패:", error);
            alert("게시글 등록에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-black-60"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-[480px] max-h-[90vh] overflow-y-auto scrollbar-hide p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-heading-20B">게시글 등록</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-base-200 transition-colors"
                    >
                        <X size={24} className="text-base-500" />
                    </button>
                </div>

                {/* 제품명 */}
                <div className="mb-4">
                    <label className="block text-body-14B text-base-700 mb-2">
                        제품명
                    </label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="제품명을 입력해주세요"
                        className="w-full px-4 py-3 border border-base-300 rounded-xl text-body-14R focus:outline-none focus:border-primary-blue-500 transition-colors"
                    />
                </div>

                {/* 사진 업로드 */}
                <div className="mb-4">
                    <label className="block text-body-14B text-base-700 mb-2">
                        사진
                    </label>
                    <label className="cursor-pointer">
                        {imagePreview ? (
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-base-300">
                                <img
                                    src={imagePreview}
                                    alt="미리보기"
                                    className="w-full h-full object-cover"
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-opacity-black-40 flex items-center justify-center">
                                        <Loader2 size={32} className="text-white animate-spin" />
                                    </div>
                                )}
                                {!isUploading && (
                                    <div className="absolute inset-0 bg-opacity-black-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white text-body-14M">
                                            변경하기
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-primary-blue-100 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary-blue-500 transition-colors">
                                <ImagePlus
                                    size={32}
                                    className="text-base-400"
                                />
                                <p className="text-body-14R text-base-400">
                                    사진을 업로드해주세요
                                </p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                    {imageKey && (
                        <p className="mt-1 text-caption-12M text-green-600">
                            ✓ 업로드 완료
                        </p>
                    )}
                </div>

                {/* 카테고리 선택 */}
                <div className="mb-4">
                    <label className="block text-body-14B text-base-700 mb-2">
                        카테고리
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(categories).map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => handleCategorySelect(category)}
                                className={`px-3 py-2 rounded-full text-caption-12M border transition-colors ${
                                    selectedCategory === category
                                        ? "bg-primary-blue-500 text-white border-primary-blue-500"
                                        : "bg-white text-base-500 border-base-300 hover:border-primary-blue-300"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 하위 카테고리 선택 */}
                {selectedCategory && categories[selectedCategory].length > 0 && (
                    <div className="mb-4">
                        <label className="block text-body-14B text-base-700 mb-2">
                            하위 카테고리
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {categories[selectedCategory].map((sub) => (
                                <button
                                    key={sub}
                                    type="button"
                                    onClick={() => setSelectedSubCategory(sub)}
                                    className={`px-3 py-2 rounded-full text-caption-12M border transition-colors ${
                                        selectedSubCategory === sub
                                            ? "bg-primary-blue-400 text-white border-primary-blue-400"
                                            : "bg-white text-base-500 border-base-300 hover:border-primary-blue-300"
                                    }`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 수량 */}
                <div className="mb-4">
                    <label className="block text-body-14B text-base-700 mb-2">
                        수량
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={quantity}
                        onChange={handleQuantityChange}
                        placeholder="숫자만 입력해주세요"
                        className="w-full px-4 py-3 border border-base-300 rounded-xl text-body-14R focus:outline-none focus:border-primary-blue-500 transition-colors"
                    />
                </div>

                {/* 보관 위치 */}
                <div className="mb-4">
                    <label className="block text-body-14B text-base-700 mb-2">
                        보관 위치
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="예: 5호관 1층 학생회실"
                        className="w-full px-4 py-3 border border-base-300 rounded-xl text-body-14R focus:outline-none focus:border-primary-blue-500 transition-colors"
                    />
                </div>

                {/* 수령 시간 */}
                <div className="mb-4">
                    <label className="block text-body-14B text-base-700 mb-2">
                        수령 시간
                    </label>
                    <input
                        type="text"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        placeholder="예: 평일 10:00 ~ 17:00"
                        className="w-full px-4 py-3 border border-base-300 rounded-xl text-body-14R focus:outline-none focus:border-primary-blue-500 transition-colors"
                    />
                </div>

                {/* 상품 설명 */}
                <div className="mb-6">
                    <label className="block text-body-14B text-base-700 mb-2">
                        상품 설명
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="상품에 대한 설명을 입력해주세요"
                        rows={4}
                        className="w-full px-4 py-3 border border-base-300 rounded-xl text-body-14R resize-none focus:outline-none focus:border-primary-blue-500 transition-colors"
                    />
                </div>

                {/* 등록 버튼 */}
                <button
                    onClick={handleSubmit}
                    disabled={
                        !productName ||
                        !selectedCategory ||
                        !selectedSubCategory ||
                        !quantity ||
                        isUploading ||
                        isSubmitting
                    }
                    className="w-full py-3 rounded-xl text-body-16SB text-white bg-primary-blue-500 hover:bg-primary-blue-600 disabled:bg-base-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    {isSubmitting ? "등록 중..." : "등록하기"}
                </button>
            </div>
        </div>
    );
};

export default PostModal;
