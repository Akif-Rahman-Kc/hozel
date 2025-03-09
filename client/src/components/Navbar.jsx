import React, { useState } from 'react';
import { faSignOutAlt, faBars, faChartSimple, faUser, faBed, faScroll, faUserTie, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function NavbarComponent({ now }) {
    const admin = localStorage.getItem("admin")
    
    // navigate
    const navigate = useNavigate()

    // states
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
        navigate('/landing')
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
                        <FontAwesomeIcon onClick={logout} icon={faSignOutAlt} color='white' size="lg" />
                    </div>
                }
            </div>
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
