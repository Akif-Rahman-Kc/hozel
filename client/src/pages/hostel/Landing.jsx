import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/Navbar";
import { HostelAuthApi } from "../../apis/hostel";

const HostelLandingPage = () => {
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
                    if (auth && auth.status === "success" && auth.auth) {
                        navigate("/hostel/dashboard")
                    }
                }
            }
        }
        auth()
    }, []);

    // return
    return (
        <>
            <NavbarComponent now={''} />
            <div className="relative flex w-full min-h-screen max-h-[1800px] justify-center items-center bg-gray-700 px-4">
                {/* Transparent Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('https://5.imimg.com/data5/SELLER/Default/2023/5/306562348/BG/CK/SY/114626164/colleges-and-hostels-construction-service.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.4, // Adjust for transparency
                        zIndex: 0,
                    }}
                ></div>
                
                {/* Content */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div onClick={() => navigate('/hostel/register')} className="bg-[#2b64a1] text-white flex w-80 h-48 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105 md:ml-10 md:mr-10 md:mb-10 md:mt-10">
                        <h1>Register</h1>
                    </div>
                    <div onClick={() => navigate('/hostel/login')} className="bg-[#2b64a1] text-white flex w-80 h-48 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105 md:ml-10 md:mr-10 md:mb-10 md:mt-10">
                        <h1>Login</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HostelLandingPage;