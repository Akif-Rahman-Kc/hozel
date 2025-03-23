import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/Navbar";
import { HostelAuthApi } from "../../apis/hostel";
import PopupAlert from "../../components/PopupAlert";
import { StudentAuthApi, StudentChangePasswordApi, StudentForgotPasswordApi } from "../../apis/student";

const ChangePasswordPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorOldPassword, setErrorOldPassword] = useState("")
    const [errorNewPassword, setErrorNewPassword] = useState("")
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("")
    const [showAlert, setShowAlert] = useState("")

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
                alert("You dont have aceess this page")
                navigate("/profile")
            } 
        }
        auth()
    }, []);

    // handle submit
    const handleSubmit = async () => {
        if (oldPassword || newPassword || confirmPassword) {
            if (oldPassword) {
                setErrorOldPassword("")
            } else {
                setErrorOldPassword("Please enter old password")
            }
            if (newPassword) {
                if (newPassword.length >= 8) {
                    setErrorNewPassword("")
                } else {
                    setErrorNewPassword("Please enter minimum 8 charecter")
                    return "error"
                }
            } else {
                setErrorNewPassword("Please enter new password")
                return "error"
            }
            if (confirmPassword) {
                if (newPassword === confirmPassword) {
                    setErrorConfirmPassword("")
                } else {
                    setErrorConfirmPassword("Password not match")
                    return "error"
                }
            } else {
                setErrorConfirmPassword("Please enter confirm password")
                return "error"
            }
            if (oldPassword && newPassword && confirmPassword) {
                if (newPassword.length >= 8) {
                    if (admin === "student") {
                        const token = localStorage.getItem("studenttoken")
                        const login = await StudentChangePasswordApi(token, { old_password: oldPassword, new_password: newPassword })
                        if (login && login.status === "success") {
                            setErrorOldPassword("")
                            setErrorNewPassword("")
                            setErrorConfirmPassword("")
                            triggerAlert()
                            setTimeout(() => {
                                navigate("/profile")
                            }, 3000);
                        } else {
                            if (login.type) {
                                login.type === "oldPassword" ? setErrorOldPassword(login?.message) : setErrorNewPassword(login?.message)
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
            if (oldPassword === "") {
                setErrorOldPassword("Please enter old password")
            }
            if (newPassword === "") {
                setErrorNewPassword("Please enter new password")
            }
            if (confirmPassword === "") {
                setErrorConfirmPassword("Please enter confirm password")
            }
        }
    };

    // popup alert trigger
    const triggerAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Auto-close after 3 seconds
    };

    // return
    return (
        <>
            <NavbarComponent now={'home'} />
            {/* Popup Alert Start */}
            {
                showAlert && (
                    <PopupAlert
                        message="Password successfully changed"
                        type="success"
                        onClose={() => setShowAlert(false)}
                    />
                )
            }
            {/* Popup Alert End */}
            <div className="relative flex w-full h-screen justify-center items-center bg-gray-700">
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
                <div className="relative w-96 border-4 border-[#1B263B] bg-gray-400 rounded-lg px-10 py-10 z-10">
                    <h1 className="text-3xl font-bold text-center mt-3 mb-6 text-black">Change Password</h1>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-800 mt-4">
                        Old Password
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="oldPassword"
                        placeholder="Enter old password"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline ${errorOldPassword ? 'border-red-500' : 'border-[#1B263B]'}`}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    {errorOldPassword && <p className="text-red-500 text-xs">{errorOldPassword}</p>}
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800 mt-4">
                        New Password
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Enter new password"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline ${errorNewPassword ? 'border-red-500' : 'border-[#1B263B]'}`}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {errorNewPassword && <p className="text-red-500 text-xs">{errorNewPassword}</p>}
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mt-4">
                        Confirm Password
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Enter confirm password"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline ${errorConfirmPassword ? 'border-red-500' : 'border-[#1B263B]'}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errorConfirmPassword && <p className="text-red-500 text-xs">{errorConfirmPassword}</p>}
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

export default ChangePasswordPage;