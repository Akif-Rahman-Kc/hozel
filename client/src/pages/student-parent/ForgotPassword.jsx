import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../../components/Navbar";
import { HostelAuthApi } from "../../apis/hostel";
import PopupAlert from "../../components/PopupAlert";
import { StudentForgotPasswordApi } from "../../apis/student";

const ForgotPasswordPage = () => {
    // navigate
    const navigate = useNavigate()

    // states
    const [studentId, setStudentId] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorStudentId, setErrorStudentId] = useState("")
    const [errorNewPassword, setErrorNewPassword] = useState("")
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("")
    const [showAlert, setShowAlert] = useState("")

    // use effect for login or not checking
    useEffect(() => {
        async function auth() {
            const admin = localStorage.getItem("admin")
            if (admin === "student") {
                const token = localStorage.getItem("studenttoken")
                if (token) {
                    const auth = await HostelAuthApi(token)
                    if (auth && auth.status === "success" && auth.auth) {
                        navigate("/home")
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
        if (studentId || newPassword || confirmPassword) {
            if (studentId) {
                setErrorStudentId("")
            } else {
                setErrorStudentId("Please enter student id")
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
            if (studentId && newPassword && confirmPassword) {
                if (newPassword.length >= 8) {
                    const admin = localStorage.getItem("admin")
                    if (admin === "student") {
                        const login = await StudentForgotPasswordApi({ student_id: studentId, new_password: newPassword })
                        if (login && login.status === "success") {
                            setErrorStudentId("")
                            setErrorNewPassword("")
                            setErrorConfirmPassword("")
                            triggerAlert()
                            setTimeout(() => {
                                navigate("/login")
                            }, 3000);
                        } else {
                            if (login.type) {
                                login.type === "studentId" ? setErrorStudentId(login?.message) : setErrorNewPassword(login?.message)
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
            if (studentId === "") {
                setErrorStudentId("Please enter student id")
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
            <NavbarComponent now={''} />
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
                    <h1 className="text-3xl font-bold text-center mt-3 mb-6 text-black">Forgot Password</h1>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-800 mt-4">
                        Student ID
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="studentId"
                        placeholder="Enter student id"
                        className={`shadow appearance-none border bg-gray-100 rounded-md w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline ${errorStudentId ? 'border-red-500' : 'border-[#1B263B]'}`}
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                    />
                    {errorStudentId && <p className="text-red-500 text-xs">{errorStudentId}</p>}
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

export default ForgotPasswordPage;