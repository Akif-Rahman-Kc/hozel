import { useEffect } from "react";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
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
            <NavbarComponent now={'dashboard'} />
            <div className="relative flex w-full h-screen justify-center items-center bg-gray-400">
                {/* Transparent Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('https://media.istockphoto.com/id/2148731493/vector/abstract-black-energy-waves-from-dotted-line-particles-with-blur-effect-on-trasnparent-white.jpg?s=612x612&w=0&k=20&c=IE499DDlZC9fAXHl4oXmkcCSsu9_9OYGkqZuaQWhZqA=')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.2, // Adjust this for the transparency of the image
                        zIndex: 0,
                    }}
                ></div>

                {/* Content Container */}
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-center mt-3 mb-6 text-black">Home</h1>
                </div>
            </div>
        </>
    );
}

export default HomePage;