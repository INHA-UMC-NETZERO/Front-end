import { useCallback, useEffect, useRef, useState } from "react";
import ItemCard from "../components/home/ItemCard";
import NavBar from "../components/home/NavBar";
import { getFeeds } from "../apis/feed";
import type { PostSummary } from "../types/post";

const HomePage = () => {
    const [items, setItems] = useState<PostSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const pageRef = useRef(0);
    const isLoadingRef = useRef(false);
    const initializedRef = useRef(false);

    const loadMore = useCallback(async () => {
        if (isLoadingRef.current || !hasNext) return;
        isLoadingRef.current = true;
        setIsLoading(true);

        try {
            const response = await getFeeds("", "", {
                page: pageRef.current,
                size: 12,
            });

            setItems((prev) => [...prev, ...response.content]);
            setHasNext(response.hasNext);
            pageRef.current += 1;
        } catch (error) {
            console.error("피드 불러오기 실패:", error);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [hasNext]);

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        loadMore();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingRef.current && hasNext) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [loadMore, hasNext]);

    return (
        <main className="w-full p-4">
            <NavBar />

            <div className="grid grid-cols-3 gap-4 py-4">
                {items.map((item) => (
                    <ItemCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        image={item.thumbnailUrl}
                        category={item.category}
                        quantity={item.remainingQuantity}
                    />
                ))}
            </div>

            <div ref={observerRef} className="h-10 flex items-center justify-center">
                {isLoading && <p className="text-caption-12R text-base-400">불러오는 중...</p>}
                {!hasNext && items.length > 0 && (
                    <p className="text-caption-12R text-base-400">모든 게시물을 불러왔습니다.</p>
                )}
            </div>
        </main>
    );
};

export default HomePage;
