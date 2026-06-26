import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/common/Header';
import SideBar from '../components/common/SideBar';
import PostButton from '../components/common/PostButton';

const PublicLayout = () => {
    const location = useLocation();
    const isDetailPage = location.pathname.startsWith("/detail");

    return (
        <div className="h-dvh flex flex-col overflow-hidden">
            <Header />
            <div className="flex flex-1 min-h-0">
                <SideBar />
                <div className="relative flex-1 overflow-y-auto scrollbar-hide">
                    <Outlet />
                </div>
                {/* Floating 게시하기 버튼 — 상세 페이지에서는 숨김 */}
                {!isDetailPage && (
                    <div className="fixed bottom-6 right-6 z-40">
                        <PostButton />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PublicLayout;
