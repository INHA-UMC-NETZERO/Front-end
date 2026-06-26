import { Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between p-4 border-b-2 border-base-300">
            <h1 className="text-heading-24B text-blue-600">InhaBada</h1>
            <div className="flex items-center gap-4">
                <button>
                    <Bell size={24} className="text-primary-blue-500" />
                </button>
                <button onClick={() => navigate("/user")}>
                    <UserCircle size={24} className="text-primary-blue-500" />
                </button>
            </div>
        </header>
    );
};

export default Header;
