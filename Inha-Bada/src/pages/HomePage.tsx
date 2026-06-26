import { useCallback, useEffect, useRef, useState } from "react";
import ItemCard from "../components/home/ItemCard";
import NavBar from "../components/NavBar";

interface Item {
    id: number;
    title: string;
    organization?: string;
    quantity?: number;
    category?: string;
    subCategory?: string;
    description?: string;
    image?: string;
}

const generateItems = (page: number, pageSize: number): Item[] => {
    const sampleCategories = ["식품", "음료", "문구 · 행사", "포장 · 정리", "가구 · 공간"];
    const sampleOrgs = ["인하대 학생회", "공과대학", "경영대학", "자연과학대학"];

    return Array.from({ length: pageSize }, (_, i) => ({
        id: page * pageSize + i,
        title: `상품 ${page * pageSize + i + 1}`,
        organization: sampleOrgs[i % sampleOrgs.length],
        quantity: Math.floor(Math.random() * 10) + 1,
        category: sampleCategories[i % sampleCategories.length],
        subCategory: "기타",
        description: "상품에 대한 간단한 설명이 여기에 표시됩니다.",
    }));
};

const HomePage = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const pageRef = useRef(0);

    const loadMore = useCallback(() => {
        if (isLoading) return;
        setIsLoading(true);

        const currentPage = pageRef.current;
        // API 호출 시뮬레이션
        setTimeout(() => {
            const newItems = generateItems(currentPage, 10);
            setItems((prev) => [...prev, ...newItems]);
            pageRef.current += 1;
            setIsLoading(false);
        }, 500);
    }, [isLoading]);

    useEffect(() => {
        loadMore();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [loadMore, isLoading]);

    return (
        <main className="w-full p-4">
            <NavBar />

            <div className="grid grid-cols-3 gap-4 py-4">
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        organization={item.organization}
                        quantity={item.quantity}
                        category={item.category}
                        subCategory={item.subCategory}
                        description={item.description}
                    />
                ))}
            </div>

            <div ref={observerRef} className="h-10 flex items-center justify-center">
                {isLoading && <p className="text-caption-12R text-base-400">불러오는 중...</p>}
            </div>
        </main>
    );
};

export default HomePage;