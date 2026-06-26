import { useState } from "react";
import { Plus } from "lucide-react";
import PostModal from "./home/PostModal";

const PostButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-14 h-14 rounded-full bg-primary-blue-500 hover:bg-primary-blue-600 text-white shadow-lg flex items-center justify-center transition-colors"
            >
                <Plus size={28} />
            </button>

            {isOpen && <PostModal onClose={() => setIsOpen(false)} />}
        </>
    );
};

export default PostButton;
