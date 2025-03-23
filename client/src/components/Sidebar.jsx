import React, { useState } from 'react';
import { faChartSimple, faUser, faBed, faScroll, faUserTie, faCircleCheck, faUtensils, faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function SidebarComponent({ now }) {
    // const admin = localStorage.getItem("admin")

    // navigate
    const navigate = useNavigate()

    // states
    const [current, setCurrent] = useState(now)

    // return
    return (
        <div className="hidden md:block md:w-60 lg:w-full max-w-80 min-h-screen fixed border-right mt-16 bg-[#1B263B]">
            <div className="w-full min-h-screen px-5 py-5 mt-3 bg-[#7b8794] rounded-lg">
                <div onClick={() => {setCurrent('dashboard'); navigate('/hostel/dashboard')}} className={current === "dashboard" ? "flex flex-row w-full bg-[#1B263B] px-8 py-3 rounded-full" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3 rounded-full"}>
                    <FontAwesomeIcon className="mt-1" icon={faChartSimple} color={current === "dashboard" ? "white" : "black"} size="md" />
                    <h1 className={current === "dashboard" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Dashboard</h1>
                </div>
                <div onClick={() => {setCurrent('students'); navigate('/hostel/students')}} className={current === "students" ? "flex flex-row w-full bg-[#1B263B] px-8 py-3 rounded-full" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3 rounded-full"}>
                    <FontAwesomeIcon className="mt-1" icon={faUser} color={current === "students" ? "white" : "black"} size="md" />
                    <h1 className={current === "students" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Students</h1>
                </div>
                <div onClick={() => {setCurrent('parents'); navigate('/hostel/parents')}} className={current === "parents" ? "flex flex-row w-full bg-[#1B263B] px-8 py-3 rounded-full" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3 rounded-full"}>
                    <FontAwesomeIcon className="mt-1" icon={faUserTie} color={current === "parents" ? "white" : "black"} size="md" />
                    <h1 className={current === "parents" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Parents</h1>
                </div>
                <div onClick={() => {setCurrent('rooms'); navigate('/hostel/rooms')}} className={current === "rooms" ? "flex flex-row w-full bg-[#1B263B] px-8 py-3 rounded-full" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3 rounded-full"}>
                    <FontAwesomeIcon className="mt-1" icon={faBed} color={current === "rooms" ? "white" : "black"} size="md" />
                    <h1 className={current === "rooms" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Rooms</h1>
                </div>
                <div onClick={() => {setCurrent('menus'); navigate('/hostel/menus')}} className={current === "menus" ? "flex flex-row w-full bg-[#1B263B] px-8 py-3 rounded-full" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3 rounded-full"}>
                    <FontAwesomeIcon className="mt-1" icon={faUtensils} color={current === "menus" ? "white" : "black"} size="md" />
                    <h1 className={current === "menus" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Menus</h1>
                </div>
                <div onClick={() => {setCurrent('complaints'); navigate('/hostel/complaints')}} className={current === "complaints" ? "flex flex-row w-full bg-[#1B263B] px-8 py-3 rounded-full" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3 rounded-full"}>
                    <FontAwesomeIcon className="mt-1" icon={faScroll} color={current === "complaints" ? "white" : "black"} size="md" />
                    <h1 className={current === "complaints" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Complaints</h1>
                </div>
                <div onClick={() => {setCurrent('checkins'); navigate('/hostel/checkins')}} className={current === "checkins" ? "flex flex-row w-full bg-[#1B263B] px-8 py-3 rounded-full" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3 rounded-full"}>
                    <FontAwesomeIcon className="mt-1" icon={faCircleCheck} color={current === "checkins" ? "white" : "black"} size="md" />
                    <h1 className={current === "checkins" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Check In</h1>
                </div>
                <div onClick={() => {setCurrent('entryexits'); navigate('/hostel/entryexits')}} className={current === "entryexits" ? "flex flex-row w-full bg-[#1B263B] px-8 py-3 rounded-full" : "flex flex-row w-full hover:bg-gray-500 px-8 py-3 rounded-full"}>
                    <FontAwesomeIcon className="mt-1" icon={faPersonWalkingArrowRight} color={current === "entryexits" ? "white" : "black"} size="md" />
                    <h1 className={current === "entryexits" ? "text-md font-semibold text-white ml-2" : "text-md font-semibold text-black ml-2"}>Entry & Exit</h1>
                </div>
            </div>
        </div>
    );
}

export default SidebarComponent;
