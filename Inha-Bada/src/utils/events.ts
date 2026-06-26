// 앱 전역 데이터 새로고침 이벤트
const REFRESH_EVENT = "inha:data-refresh";

export const emitDataRefresh = () => {
    window.dispatchEvent(new Event(REFRESH_EVENT));
};

export const onDataRefresh = (handler: () => void) => {
    window.addEventListener(REFRESH_EVENT, handler);
    return () => window.removeEventListener(REFRESH_EVENT, handler);
};
