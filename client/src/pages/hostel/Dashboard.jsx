import { useEffect } from "react";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi } from "../../apis/hostel";
import StudentReportChart from "../../components/StudentReport";
import ComplaintReportChart from "../../components/ComplaintReport";
import RoomReportChart from "../../components/RoomReport";


const HostelDashboardPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // use effect for login or not checking
    useEffect(() => {
        async function auth() {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                if (token) {
                    const auth = await HostelAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/hostel/login")
                    }
                }
            } else {
                alert("You dont have access this page")
                localStorage.removeItem('admin');
                navigate('/')
            } 
        }
        auth()
    }, []);

    // return
    return (
        <>
            <NavbarComponent now={'dashboard'} />
            <SidebarComponent now={'dashboard'} />
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-[#1B263B]">
                <div className="w-full min-h-screen rounded-lg px-5 py-5 mt-3 bg-[#7b8794]">
                    <div>
                        <h1 className="text-xl font-bold uppercase text-center">Students</h1>
                        <StudentReportChart />
                        <div className="mt-5 width-full bg-[#1B263B] p-0.5"/>
                    </div>
                    <div className="mt-10">
                        <h1 className="text-xl font-bold uppercase text-center">Complaints</h1>
                        <ComplaintReportChart />
                        <div className="mt-5 width-full bg-[#1B263B] p-0.5"/>
                    </div>
                    <div className="mt-10">
                        <h1 className="text-xl font-bold uppercase text-center">Rooms</h1>
                        <RoomReportChart />
                        <div className="mt-5 width-full bg-[#1B263B] p-0.5"/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HostelDashboardPage;