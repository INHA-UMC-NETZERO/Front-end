import { useEffect, useRef, useState } from "react";
import ItemCard from "../components/home/ItemCard";
import ItemCardSkeleton from "../components/home/ItemCardSkeleton";
import NavBar from "../components/home/NavBar";
import { getFeeds } from "../apis/feed";
import type { PostSummary } from "../types/post";

const HomePage = () => {
    const [items, setItems] = useState<PostSummary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);
    const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const observerRef = useRef<HTMLDivElement | null>(null);
    const pageRef = useRef(0);
    const isLoadingRef = useRef(false);
    const sortRef = useRef(sortOrder);
    const keywordRef = useRef(keyword);
    const categoryRef = useRef(category);

    const fetchItems = async (page: number, sort: "latest" | "oldest", search: string, cat: string) => {
        const sortParam = sort === "latest" ? "createdAt,desc" : "createdAt,asc";
        const response = await getFeeds(cat, search, {
            page,
            size: 12,
            sort: [sortParam],
        });
        return response;
    };

    const loadMore = async () => {
        if (isLoadingRef.current || !hasNext) return;
        isLoadingRef.current = true;
        setIsLoading(true);

        try {
            const response = await fetchItems(pageRef.current, sortRef.current, keywordRef.current, categoryRef.current);
            const incoming = response.content ?? [];

            setItems((prev) => {
                const existingIds = new Set(prev.map((item) => item.id));
                const newItems = incoming.filter((item) => !existingIds.has(item.id));
                return [...prev, ...newItems];
            });

            // 새로 받은 게 없거나 서버가 마지막 페이지라고 알리면 중단
            if (incoming.length === 0 || !response.hasNext) {
                setHasNext(false);
            } else {
                pageRef.current += 1;
            }
        } catch (error) {
            console.error("피드 불러오기 실패:", error);
            setHasNext(false);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    };

    const resetAndReload = () => {
        pageRef.current = 0;
        isLoadingRef.current = false;
        setItems([]);
        setHasNext(true);
    };

    // 정렬 변경
    const handleSortChange = (sort: "latest" | "oldest") => {
        if (sort === sortRef.current) return;
        sortRef.current = sort;
        setSortOrder(sort);
        resetAndReload();
    };

    // 검색
    const handleSearch = (search: string) => {
        if (search === keywordRef.current) return;
        keywordRef.current = search;
        setKeyword(search);
        resetAndReload();
    };

    // 카테고리 필터
    const handleCategoryChange = (cat: string, sub: string) => {
        if (cat === categoryRef.current && sub === subCategory) return;
        categoryRef.current = cat;
        setCategory(cat);
        setSubCategory(sub);
        resetAndReload();
    };

    // 초기 로드 + 정렬/검색/카테고리 변경 시 첫 페이지 로드
    useEffect(() => {
        loadMore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortOrder, keyword, category]);

    // 무한 스크롤 (다음 페이지 로드)
    useEffect(() => {
        if (!hasNext) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingRef.current && hasNext) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const el = observerRef.current;
        if (el) observer.observe(el);

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNext, items.length]);

    // 클라이언트 정렬 + 하위 카테고리 필터
    const sortedItems = [...items]
        .filter((item) => (subCategory ? item.subCategory === subCategory : true))
        .sort((a, b) => {
            if (sortOrder === "latest") return b.id - a.id;
            return a.id - b.id;
        });

    return (
        <main className="w-full p-4">
            <NavBar sortOrder={sortOrder} onSortChange={handleSortChange} onSearch={handleSearch} onCategoryChange={handleCategoryChange} />

            <div className="grid grid-cols-3 gap-4 py-4">
                {sortedItems.map((item) => (
                    <ItemCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        image={item.thumbnailUrl}
                        category={item.category}
                        subCategory={item.subCategory}
                        quantity={item.remainingQuantity}
                    />
                ))}
                {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                        <ItemCardSkeleton key={`skeleton-${i}`} />
                    ))
                }
            </div>

            <div ref={observerRef} className="h-10 flex items-center justify-center">
                {isLoading && <p className="text-caption-12R text-base-400">불러오는 중...</p>}
                {!hasNext && items.length > 0 && (
                    <p className="text-caption-12R text-base-400">모든 게시물을 불러왔습니다.</p>
                )}
                {!isLoading && !hasNext && items.length === 0 && (
                    <p className="text-body-14R text-base-400">검색 결과가 없습니다.</p>
                )}
            </div>
        </main>
    );
};

export default HomePage;
