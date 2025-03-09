import { useEffect } from "react";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi } from "../../apis/hostel";


const HostelDashboardPage = () => {
    // navigate
    const navigate = useNavigate()

    // use effect for login or not checking
    useEffect(() => {
        async function auth() {
            const admin = localStorage.getItem("admin")
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                if (token) {
                    const auth = await HostelAuthApi(token)
                    if (!auth || !auth.auth) {
                        navigate("/landing")
                    }
                } else {
                    navigate("/landing")
                }
            } else {
                alert("You dont have access this page")
                localStorage.removeItem('admin');
                navigate('/landing')
            }
        }
        auth()
    }, []);

    // return
    return (
        <>
            <NavbarComponent now={'dashboard'} />
            <SidebarComponent now={'dashboard'} />
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-gray-400">
                <div className="w-full min-h-screen px-5 py-5 mt-3">
                    <h1 className="text-3xl text-black font-bold text-center">Dashboard</h1>
                </div>
            </div>
        </>
    );
}

export default HostelDashboardPage;