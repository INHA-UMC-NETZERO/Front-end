import { useState, useRef } from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = () => {
        if (!query.trim()) return;
        // TODO: 검색 로직 구현
        console.log("검색:", query);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div
            onClick={() => inputRef.current?.focus()}
            className="flex w-100 h-[35.6px] border-1 bg-gray-100 border-base-300 rounded-full items-center justify-between px-4 cursor-text focus-within:border-primary-blue-500 transition-colors"
        >
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="검색하기"
                className="flex-1 bg-transparent text-body-14M text-base-700 placeholder:text-base-300 outline-none"
            />
            <button onClick={handleSearch}>
                <Search size={18} className="text-base-400 hover:text-primary-blue-500 transition-colors" />
            </button>
        </div>
    );
};

export default SearchBar;
