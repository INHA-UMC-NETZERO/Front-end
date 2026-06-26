import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header';
import SideBar from '../components/common/SideBar';

const PublicLayout = () => {
    return (
        <>
            <Header /> 
            <SideBar />
            <div>
                <Outlet />
            </div>
        </>
    )
}

export default PublicLayout;