import type { NotificationItem, NotificationListResponse, Pageable } from "../types/notification";
import axiosInstance from "./axios";
import { getUserId } from "../utils/auth";

export const getNotifications = async (pageable: Pageable): Promise<NotificationListResponse> => {
    const response = await axiosInstance.get("/api/notifications", {
        params: {
            userId: getUserId(),
            page: pageable.page,
            size: pageable.size,
            sort: pageable.sort?.[0] || undefined,
        },
    });

    return response.data;
};

export const patchNotifications = async () => {
    const response = await axiosInstance.patch("/api/notifications/read-all", null, {
        params: {
            userId: getUserId(),
        },
    });
    return response.data;
};

// SSE 실시간 알림 구독
export const subscribeNotifications = (
    onMessage: (data: NotificationItem | null) => void
): EventSource | null => {
    const userId = getUserId();
    if (userId === null) return null;

    const baseURL = import.meta.env.VITE_SERVER_API_URL || "http://localhost:8080";
    const eventSource = new EventSource(
        `${baseURL}/api/notifications/stream?userId=${userId}`
    );

    const handleEvent = (event: MessageEvent) => {
        try {
            const parsed = event.data ? JSON.parse(event.data) : null;
            // heartbeat/timeout 같은 데이터는 무시
            if (parsed && typeof parsed === "object" && "id" in parsed) {
                onMessage(parsed as NotificationItem);
            } else {
                onMessage(null);
            }
        } catch {
            // 파싱 불가한 데이터(연결 확인용 등)는 재조회 트리거
            onMessage(null);
        }
    };

    // 기본 message 이벤트
    eventSource.onmessage = handleEvent;
    // 서버가 named 이벤트로 보내는 경우 대응
    eventSource.addEventListener("notification", handleEvent as EventListener);

    eventSource.onerror = (error) => {
        console.error("알림 스트림 연결 오류:", error);
    };

    return eventSource;
};
