import React, { useState } from 'react';
import { faSignOutAlt, faBars, faChartSimple, faUser, faBed, faScroll, faUserTie, faCircleCheck, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function NavbarComponent({ now }) {
    const admin = localStorage.getItem("admin")
    
    // navigate
    const navigate = useNavigate()

    // states
    const [isLogoutModal, setIsLogoutModal] = useState(false)
    const [renderSideBar, setRenderSidebar] = useState(false)
    const [current, setCurrent] = useState(now)

    // logout
    const logout = () => {
        if (admin === "hostel") {
            localStorage.removeItem("hosteltoken")
        } else if (admin === "parent") {
            localStorage.removeItem("parenttoken")
        } else {
            localStorage.removeItem("studenttoken")
        }
        localStorage.removeItem('admin');
        navigate('/')
    }

    // return
    return (
        <>
            <div className="flex flex-row w-full h-16 fixed px-9 z-50 bg-blue-800">
                {
                    now &&
                    <div className='flex justify-center items-center md:hidden'>
                        <FontAwesomeIcon onClick={() => setRenderSidebar(!renderSideBar)} icon={faBars} color='white' size="lg" />
                    </div>
                }
                <div className="flex w-22 h-16 justify-center items-center ml-3">
                    <h1 className="text-lg font-bold text-white">HMS App</h1>
                </div>
                {
                    now &&
                    <div className='flex justify-center items-center ml-auto'>
                        <FontAwesomeIcon onClick={() => setIsLogoutModal(true)} icon={faSignOutAlt} color='white' size="lg" />
                    </div>
                }
            </div>
            {/* Logout Modal Start */}
            {isLogoutModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-40">
                    <div className="bg-gray-700 p-6 rounded shadow-lg w-96 relative">
                        {/* close button */}
                        <button
                            className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                            onClick={() => setIsLogoutModal(false)}
                        >
                            &times;
                        </button>
                        {/* model content */}
                        <h2 className="text-lg text-white font-bold mb-2">Are you sure?</h2>
                        <p className="mb-7 text-sm text-gray-300">Do you want to logout this account?</p>
                        {/* yes or no button */}
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setIsLogoutModal(false)}
                                className="border-2 border-red-500 text-red-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-red-500 active:bg-red-600"
                            >
                                No
                            </button>
                            <button
                                onClick={logout}
                                className="border-2 border-green-500 text-green-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-green-500 active:bg-green-600"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Logout Modal End */}
            {/* sm side bar */}
            {
                renderSideBar && now &&
                <div className="w-52 min-h-screen bg-gray-400 fixed border border-gray-600 border-right mt-16 md:hidden">
                    <div className="w-full min-h-screen">
                        <div onClick={() => {setCurrent('dashboard'); navigate('/hostel/dashboard')}} className={current === "dashboard" ? "flex flex-row w-full bg-blue-800 px-8 py-3" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3"}>
                            <FontAwesomeIcon className="mt-1" icon={faChartSimple} color={current === "dashboard" ? "white" : "black"} size="md" />
                            <h1 className={current === "dashboard" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Dashboard</h1>
                        </div>
                        <div onClick={() => {setCurrent('students'); navigate('/hostel/students')}} className={current === "students" ? "flex flex-row w-full bg-blue-800 px-8 py-3" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3"}>
                            <FontAwesomeIcon className="mt-1" icon={faUser} color={current === "students" ? "white" : "black"} size="md" />
                            <h1 className={current === "students" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Students</h1>
                        </div>
                        <div onClick={() => {setCurrent('parents'); navigate('/hostel/parents')}} className={current === "parents" ? "flex flex-row w-full bg-blue-800 px-8 py-3" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3"}>
                            <FontAwesomeIcon className="mt-1" icon={faUserTie} color={current === "parents" ? "white" : "black"} size="md" />
                            <h1 className={current === "parents" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Parents</h1>
                        </div>
                        <div onClick={() => {setCurrent('rooms'); navigate('/hostel/rooms')}} className={current === "rooms" ? "flex flex-row w-full bg-blue-800 px-8 py-3" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3"}>
                            <FontAwesomeIcon className="mt-1" icon={faBed} color={current === "rooms" ? "white" : "black"} size="md" />
                            <h1 className={current === "rooms" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Rooms</h1>
                        </div>
                        <div onClick={() => {setCurrent('menus'); navigate('/hostel/menus')}} className={current === "menus" ? "flex flex-row w-full bg-blue-800 px-8 py-3" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3"}>
                            <FontAwesomeIcon className="mt-1" icon={faUtensils} color={current === "menus" ? "white" : "black"} size="md" />
                            <h1 className={current === "menus" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Menus</h1>
                        </div>
                        <div onClick={() => {setCurrent('complaints'); navigate('/hostel/complaints')}} className={current === "complaints" ? "flex flex-row w-full bg-blue-800 px-8 py-3" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3"}>
                            <FontAwesomeIcon className="mt-1" icon={faScroll} color={current === "complaints" ? "white" : "black"} size="md" />
                            <h1 className={current === "complaints" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Complaints</h1>
                        </div>
                        <div onClick={() => {setCurrent('checkins'); navigate('/hostel/checkins')}} className={current === "checkins" ? "flex flex-row w-full bg-blue-800 px-8 py-3" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3"}>
                            <FontAwesomeIcon className="mt-1" icon={faCircleCheck} color={current === "checkins" ? "white" : "black"} size="md" />
                            <h1 className={current === "checkins" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Check In</h1>
                        </div>
                    </div>
                </div>
            }
        </>

    );
}

export default NavbarComponent;
