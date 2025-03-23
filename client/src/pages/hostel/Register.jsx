import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/Navbar";
import { HostelAuthApi, HostelLoginApi, HostelRegisterApi } from "../../apis/hostel";

const HostelRegisterPage = () => {
    // navigate
    const navigate = useNavigate()

    // states
    const [wardenName, setWardenName] = useState("")
    const [address, setAddress] = useState("")
    const [hostelName, setHostelName] = useState("")
    const [collegeName, setCollegeName] = useState("")
    const [wardenMobileNo, setWardenMobileNo] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

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
        if (wardenName && address && hostelName && collegeName && wardenMobileNo && username && password) {
            if (password.length >= 8) {
                if (wardenMobileNo.length === 10) {
                    const admin = localStorage.getItem("admin")
                    if (admin === "hostel") {
                        const data = {
                            "warden_name":wardenName,
                            "address":address,
                            "hostel_name":hostelName,
                            "college_name":collegeName,
                            "warden_mobile_no":wardenMobileNo,
                            "username":username,
                            "password":password,
                        }
                        const login = await HostelRegisterApi(data)
                        if (login && login.status === "success" && login.auth) {
                            localStorage.setItem("hosteltoken", login.token)
                            navigate("/hostel/dashboard")
                        } else {
                            alert(login?.message)
                        }
                    } else {
                        alert("You dont have access this page")
                        localStorage.removeItem('admin');
                        navigate('/')
                    }
                } else {
                    alert("Mobile number should be 10 digits")
                }
            } else {
                alert("password should be 8 charecter")
            }
        } else {
            alert("Please enter full details")
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
                <div className="relative w-96 border-4 border-[#1B263B] bg-gray-400 rounded-lg px-10 py-5 z-10 mt-10">
                    <h1 className="text-3xl font-bold text-center mt-2 mb-4 text-black">Register</h1>
                    <input
                        type="text"
                        id="wardenName"
                        placeholder="Enter warden name"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-1.5 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline mt-4`}
                        value={wardenName}
                        onChange={(e) => setWardenName(e.target.value)}
                    />
                    <input
                        type="text"
                        id="address"
                        placeholder="Enter address"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-1.5 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline mt-4`}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        id="hostelName"
                        placeholder="Enter hostel name"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-1.5 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline mt-4`}
                        value={hostelName}
                        onChange={(e) => setHostelName(e.target.value)}
                    />
                    <input
                        type="text"
                        id="collegeName"
                        placeholder="Enter college name"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-1.5 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline mt-4`}
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                    />
                    <input
                        type="text"
                        id="wardenMobileNo"
                        placeholder="Enter warden mobile no"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-1.5 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline mt-4`}
                        value={wardenMobileNo}
                        onChange={(e) => setWardenMobileNo(e.target.value)}
                    />
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-1.5 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline mt-4`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-1.5 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline mt-4`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleSubmit}
                        className="w-full border-4 border-[#1B263B] hover:bg-[#1B263B] text-black hover:text-white text-md font-bold py-1.5 px-4 rounded-md focus:outline-none focus:shadow-outline mt-4 mb-4"
                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        </>
    );
}

export default HostelRegisterPage;