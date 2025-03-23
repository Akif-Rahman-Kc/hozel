import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/Navbar";
import { HostelAuthApi, HostelLoginApi } from "../../apis/hostel";

const HostelLoginPage = () => {
    // navigate
    const navigate = useNavigate()

    // states
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorUsername, setErrorUsername] = useState("")
    const [errorPassword, setErrorPassword] = useState("")

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
            } else {
                alert("You dont have access this page")
                localStorage.removeItem('admin');
                navigate('/')
            } 
        }
        auth()
    }, []);

    // handle submit
    const handleSubmit = async () => {
        if (username || password) {
            if (username) {
                setErrorUsername("")
            }
            if (password) {
                if (password.length >= 8) {
                    setErrorPassword("")
                } else {
                    setErrorPassword("Please enter valid password")
                }
            }
            if (username && password) {
                if (password.length >= 8) {
                    const admin = localStorage.getItem("admin")
                    if (admin === "hostel") {
                        const login = await HostelLoginApi({ username, password })
                        if (login && login.status === "success" && login.auth) {
                            setErrorUsername("")
                            setErrorPassword("")
                            localStorage.setItem("hosteltoken", login.token)
                            navigate("/hostel/dashboard")
                        } else {
                            if (login.type) {
                                login.type === "username" ? setErrorUsername(login?.message) : setErrorPassword(login?.message)
                            } else {
                                alert(login?.message)
                            }
                        }
                    } else {
                        alert("You dont have access this page")
                        localStorage.removeItem('admin');
                        navigate('/')
                    }
                }
            }
        } else {
            if (username === "") {
                setErrorUsername("Please enter username")
            }
            if (password === "") {
                setErrorPassword("Please enter password")
            }
        }
    };

    // return
    return (
        <>
            <NavbarComponent now={''} />
            <div className="relative flex w-full h-screen justify-center items-center bg-gray-700">
                {/* Transparent Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('https://archello.s3.eu-central-1.amazonaws.com/images/2021/05/06/charged-voids-cgc-student-hostel-landran-student-housing-archello.1620328313.0563.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.4, // Adjust this for the transparency of the image
                        zIndex: 0,
                    }}
                ></div>

                {/* Content Container */}
                <div className="relative w-96 border-4 border-[#1B263B] bg-gray-400 rounded-lg px-10 py-10 z-10">
                    <h1 className="text-3xl font-bold text-center mt-3 mb-6 text-black">Login</h1>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline mt-4 ${errorUsername ? 'border-red-500' : 'border-[#1B263B]'}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errorUsername && <p className="text-red-500 text-xs">{errorUsername}</p>}
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline mt-4 ${errorPassword ? 'border-red-500' : 'border-[#1B263B]'}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorPassword && <p className="text-red-500 text-xs">{errorPassword}</p>}
                    <p onClick={() => navigate("/hostel/forgot-password")} className="underline text-xs font-semibold w-fit ml-auto text-blue-700 mt-1 hover:text-blue-900 cursor-pointer">Forgot password</p>
                    <button
                        onClick={handleSubmit}
                        className="w-full border-4 border-[#1B263B] hover:bg-[#1B263B] text-black hover:text-white text-md font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mt-8 mb-8"
                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        </>
    );
}

export default HostelLoginPage;