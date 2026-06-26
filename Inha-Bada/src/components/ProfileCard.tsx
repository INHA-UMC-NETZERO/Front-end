import { useNavigate } from "react-router-dom";
import { Leaf, Gift, Package } from "lucide-react";

const ProfileCard = () => {
    const navigate = useNavigate();

    // TODO: 실제 유저 데이터로 교체
    const user = {
        nickname: "닉네임",
        department: "공과대학 컴퓨터공학과",
        profileImage:
            "https://mblogthumb-phinf.pstatic.net/MjAyMTAxMjRfMTE2/MDAxNjExNDczMDE4MTM3.6HwFNCasGUnAxBuzzvqbrSgn0zcZV7OLgtwbNjkEWl4g.pm3IAwO7J0T0KWDgAOqaXs_yS07XjLKUFdsIMGSbflEg.JPEG.binbe/bros_blank.jpg?type=w800",
        givenCount: 8,
        receivedCount: 3,
        carbonSaved: 6.7,
    };

    return (
        <div
        onClick={() => navigate("/user")}
        className="flex flex-col gap-3 cursor-pointer hover:bg-primary-blue-100 transition-colors rounded-xl -m-4 p-4"
        >
            {/* 프로필 상단 */}
            <div className="flex items-center gap-3">
                <img
                    className="w-12 h-12 rounded-full object-cover"
                    alt="프로필"
                    src={user.profileImage}
                />
                <div className="flex flex-col">
                    <p className="text-body-14B text-base-800">{user.nickname}</p>
                    <p className="text-caption-12R text-base-400">{user.department}</p>
                </div>
            </div>

            {/* 활동 요약 */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <Gift size={14} className="text-primary-blue-400" />
                    <span className="text-caption-12M text-base-600">나눔 {user.givenCount}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Package size={14} className="text-primary-blue-400" />
                    <span className="text-caption-12M text-base-600">받음 {user.receivedCount}</span>
                </div>
            </div>

            {/* 탄소 절감 */}
            <div className="flex items-center gap-1 px-2 py-1.5 bg-green-100 rounded-lg">
                <Leaf size={14} className="text-green-500" />
                <span className="text-caption-12M text-green-700">
                    총 {user.carbonSaved}kg CO₂ 절감
                </span>
            </div>
        </div>
    );
};

export default ProfileCard;
