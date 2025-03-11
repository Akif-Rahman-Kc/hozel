import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import { HostelAuthApi } from "../apis/hostel";
import { ParentAuthApi } from "../apis/parent";
import { StudentAuthApi } from "../apis/student";

const LandingPage = () => {
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
            } else if (admin === "parent") {
                const token = localStorage.getItem("parenttoken")
                if (token) {
                    const auth = await ParentAuthApi(token)
                    if (auth && auth.status === "success" && auth.auth) {
                        navigate("/parent/home")
                    }
                }
            } else {
                const token = localStorage.getItem("studenttoken")
                if (token) {
                    const auth = await StudentAuthApi(token)
                    if (auth && auth.status === "success" && auth.auth) {
                        navigate("/student/home")
                    }
                }
            }
        }
        auth()
    }, []);

    // handle submit
    const handleSubmit = (admin) => {
        localStorage.setItem("admin", admin)
        if (admin === "hostel") {
            navigate("/hostel/login")
        } else if (admin === "parent") {
            navigate("/login")
        } else {
            navigate("/login")
        }
    }

    // return
    return (
        <>
            <NavbarComponent now={''} />
            <div className="relative flex w-full h-screen justify-center items-center bg-gray-100 px-4">
                {/* Transparent Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('https://media.istockphoto.com/id/2148731493/vector/abstract-black-energy-waves-from-dotted-line-particles-with-blur-effect-on-trasnparent-white.jpg?s=612x612&w=0&k=20&c=IE499DDlZC9fAXHl4oXmkcCSsu9_9OYGkqZuaQWhZqA=')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.2, // Adjust for transparency
                        zIndex: 0,
                    }}
                ></div>
                
                {/* Content */}
                <div className="relative flex">
                    <div
                        onClick={() => handleSubmit('student')}
                        style={{
                            backgroundImage: `url('https://media.istockphoto.com/id/1414156193/photo/modern-college-dorm-room-with-cardboard-boxes-and-luggages.jpg?s=612x612&w=0&k=20&c=utbpq_YUxMluRnVkvMDVr33XF3XOHkcBNo9H40fe3u4=')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            zIndex: 0,
                            
                        }}
                        className="border-2 border-blue-800 flex w-96 h-52 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105"
                    >
                        <h1>Student</h1>
                    </div>
                    <div
                        onClick={() => handleSubmit('parent')}
                        style={{
                            backgroundImage: `url('https://plus.unsplash.com/premium_photo-1717026836061-32ec43465f9b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aG9zdGVsc3xlbnwwfHwwfHx8MA%3D%3D')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            zIndex: 0,
                        }}
                        className="border-2 border-blue-800 flex w-96 h-52 ml-3 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105"
                    >
                        <h1>Parent</h1>
                    </div>
                    <div
                        onClick={() => handleSubmit('hostel')}
                        style={{
                            backgroundImage: `url('https://media.istockphoto.com/id/1292522563/photo/modern-college-dorm-room-with-messy-bunk-beds-and-parquet-floor.jpg?s=612x612&w=0&k=20&c=Kq36voIf8cmnQaGv0Q1UdPf3Ty5mOpHdjoFj8Ly4Phw=')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            zIndex: 0,
                        }}
                        className="border-2 border-blue-800 flex w-96 h-52 ml-3 justify-center items-center rounded-lg px-10 py-10 font-bold text-xl uppercase cursor-pointer transition-transform duration-300 hover:scale-105"
                    >
                        <h1>Hostel</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LandingPage;