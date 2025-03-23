import { useEffect } from "react";
import NavbarComponent from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StudentAuthApi } from "../../apis/student";
import { ParentAuthApi } from "../../apis/parent";


const HomePage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // use effect for login or not checking
    useEffect(() => {
        async function auth() {
            if (admin === "student") {
                const token = localStorage.getItem("studenttoken")
                if (token) {
                    const auth = await StudentAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                }
            } else {
                const token = localStorage.getItem("parenttoken")
                if (token) {
                    const auth = await ParentAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                }
            } 
        }
        auth()
    }, []);

    // return
    return (
        <>
            <NavbarComponent now={'home'} />
            <div className="relative flex w-full min-h-screen max-h-[1800px] justify-center items-center bg-gray-400">
                {/* Transparent Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('https://media.istockphoto.com/id/2148731493/vector/abstract-black-energy-waves-from-dotted-line-particles-with-blur-effect-on-trasnparent-white.jpg?s=612x612&w=0&k=20&c=IE499DDlZC9fAXHl4oXmkcCSsu9_9OYGkqZuaQWhZqA=')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.4, // Adjust this for the transparency of the image
                        zIndex: 0,
                    }}
                ></div>

                {/* Content Container */}
                <div className="relative w-3/4 md:mr-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 z-10 mt-20">
                    {/* <div onClick={() => navigate('/rooms')} className="bg-[#375d99] text-white flex w-80 h-48 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105 md:ml-10 md:mr-10 md:mb-10 md:mt-10">
                        <h1>Rooms</h1>
                    </div> */}
                    <div onClick={() => navigate('/menus')} className="bg-[#3d702e] text-white flex w-full h-48 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105 md:ml-10 md:mr-10 md:mb-10 md:mt-10">
                        <h1>Menus</h1>
                    </div>
                    <div onClick={() => navigate('/complaints')} className="bg-[#615d34] text-white flex w-full h-48 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105 md:ml-10 md:mr-10 md:mb-10 md:mt-10">
                        <h1>Complaints</h1>
                    </div>
                    <div onClick={() => navigate('/attendance')} className="bg-[#5e3d3a] text-white flex w-full h-48 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105 md:ml-10 md:mr-10 md:mb-10 md:mt-10">
                        <h1>Attendance</h1>
                    </div>
                    {/* <div onClick={() => navigate('/my-room')} className="bg-[#2e5763] text-white flex w-80 h-48 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105 md:ml-10 md:mr-10 md:mb-10 md:mt-10">
                        <h1>My Room</h1>
                    </div> */}
                    <div onClick={() => navigate('/profile')} className="bg-[#573a5e] text-white flex w-full h-48 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105 md:ml-10 md:mr-10 md:mb-10 md:mt-10">
                        <h1>Profile</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;