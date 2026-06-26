import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header';
import SideBar from '../components/common/SideBar';
import PostButton from '../components/PostButton';

const PublicLayout = () => {
    return (
        <div className="h-dvh flex flex-col overflow-hidden">
            <Header />
            <div className="flex flex-1 min-h-0">
                <SideBar />
                <div className="relative flex-1 overflow-y-auto scrollbar-hide">
                    <Outlet />
                    {/* Floating 게시하기 버튼 */}
                    <div className="sticky bottom-6 float-right mr-6">
                        <PostButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicLayout;
