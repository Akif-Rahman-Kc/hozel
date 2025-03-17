import { useEffect } from "react";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi } from "../../apis/hostel";


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
                    <h1 className="font-extrabold text-center mt-60 text-xl">Dashboard</h1>
                </div>
            </div>
        </>
    );
}

export default HostelDashboardPage;