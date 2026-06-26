import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email.trim() || !nickname.trim()) {
            setError("이메일과 닉네임을 입력해주세요.");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            await login({ email, nickname });
            navigate("/");
        } catch (err) {
            console.error("로그인 실패:", err);
            setError("로그인에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <main className="h-dvh flex items-center justify-center bg-white-background">
            <div className="w-[400px] p-8 bg-white border border-base-300 rounded-2xl shadow-lg">
                <h1 className="text-heading-24B text-blue-600 text-center mb-2">InhaBada</h1>
                <p className="text-body-14R text-base-400 text-center mb-8">
                    인하대학교 물품 나눔 플랫폼
                </p>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-body-14B text-base-700 mb-2">이메일</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="이메일을 입력해주세요"
                            className="w-full px-4 py-3 border border-base-300 rounded-xl text-body-14R focus:outline-none focus:border-primary-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-body-14B text-base-700 mb-2">닉네임</label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="닉네임을 입력해주세요"
                            className="w-full px-4 py-3 border border-base-300 rounded-xl text-body-14R focus:outline-none focus:border-primary-blue-500 transition-colors"
                        />
                    </div>

                    {error && (
                        <p className="text-caption-12M text-red-500">{error}</p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full py-3 mt-2 rounded-xl text-body-16SB text-white bg-primary-blue-500 hover:bg-primary-blue-600 disabled:bg-base-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
