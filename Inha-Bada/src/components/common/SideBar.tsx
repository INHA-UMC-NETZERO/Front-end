import CarbonGraph from "./CarbonGraph";
import CarbonIndex from "./CarbonIndex";
import ProfileCard from "./ProfileCard";

const SideBar = () => {
    return (
        <div className="h-full p-4 w-[25%] bg-gray-background border-r-2 border-base-300">
            <div className="flex flex-col gap-2 h-full">
                <div className="p-4 w-full bg-base-100 border-1 border-base-300 rounded-xl">
                    <ProfileCard />
                </div>

                <div className="p-4 w-full bg-base-100 border-1 border-base-300 rounded-xl">
                    <CarbonIndex />
                </div>

                <div className="p-4 w-full flex-1 bg-base-100 border-1 border-base-300 rounded-xl">
                    <CarbonGraph />
                </div>
            </div>
        </div>
    );
};

export default SideBar;
