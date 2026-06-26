import { useState, useRef, useEffect } from "react";
import { Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, patchNotifications, subscribeNotifications } from "../../apis/notification";
import { isLoggedIn } from "../../utils/auth";
import type { NotificationItem } from "../../types/notification";

const Header = () => {
    const navigate = useNavigate();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const notifRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        if (!isLoggedIn()) return;

        const fetchNotifications = async () => {
            try {
                const res = await getNotifications({ page: 0, size: 20 });
                setNotifications(res.content);
            } catch (error) {
                console.error("알림 불러오기 실패:", error);
            }
        };

        fetchNotifications();

        // SSE 실시간 알림 구독 — 새 알림 수신 시 즉시 반영
        const eventSource = subscribeNotifications((data) => {
            if (data) {
                // 받은 알림을 목록 맨 앞에 즉시 추가 (중복 방지)
                setNotifications((prev) => {
                    if (prev.some((n) => n.id === data.id)) return prev;
                    return [data, ...prev];
                });
            } else {
                // 데이터가 없으면 전체 재조회
                fetchNotifications();
            }
        });

        return () => {
            eventSource?.close();
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatTime = (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toLocaleString("ko-KR", {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleBellClick = async () => {
        const next = !isNotifOpen;
        setIsNotifOpen(next);

        // 알림 열 때 모두 읽음 처리
        if (next && unreadCount > 0) {
            try {
                await patchNotifications();
                setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            } catch (error) {
                console.error("알림 읽음 처리 실패:", error);
            }
        }
    };

    return (
        <header className="flex items-center justify-between p-4 border-b-2 border-base-300">
            <button 
            onClick={() => {navigate('/')}}
            className="text-heading-eng-28B text-blue-600">
                InhaBada
            </button>
            <div className="flex items-center justify-center gap-4">
                {/* 알림 */}
                <div className="relative justify-center items-center" ref={notifRef}>
                    <button onClick={handleBellClick} className="relative top-1 items-center justify-center">
                        <Bell size={24} className="text-primary-blue-500" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-base-300 rounded-xl shadow-lg z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-base-200">
                                <p className="text-body-14B text-base-800">알림</p>
                            </div>
                            <div className="max-h-72 overflow-y-auto scrollbar-hide">
                                {notifications.length === 0 ? (
                                    <div className="py-8 text-center text-caption-12R text-base-400">
                                        알림이 없습니다.
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => {
                                                if (notif.relatedPostId) {
                                                    navigate(`/detail/${notif.relatedPostId}`);
                                                    setIsNotifOpen(false);
                                                }
                                            }}
                                            className={`px-4 py-3 border-b border-base-100 hover:bg-gray-background transition-colors cursor-pointer ${
                                                !notif.isRead ? "bg-primary-blue-100/30" : ""
                                            }`}
                                        >
                                            <p className="text-caption-12M text-base-700">
                                                {notif.message}
                                            </p>
                                            <p className="text-caption-12R text-base-400 mt-1">
                                                {formatTime(notif.createdAt)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 프로필 */}
                <button onClick={() => {
                    navigate(isLoggedIn() ? "/user" : "/login");
                }}>
                    <UserCircle size={24} className="text-primary-blue-500" />
                </button>
            </div>
        </header>
    );
};

export default Header;
