import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StudentAuthApi, StudentRoomList } from "../../apis/student";
import { ParentAuthApi, ParentRoomList } from "../../apis/parent";


const RoomsPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [rooms, setRooms] = useState([])
    const [hostelId, setHostelId] = useState("")

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
                    setHostelId(auth?.student_details?.hostel_id)
                }
            } else {
                const token = localStorage.getItem("parenttoken")
                if (token) {
                    const auth = await ParentAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                    setHostelId(auth?.parent_details?.hostel_id)
                }
            }
        }
        auth()
    }, []);

    // use effect fetching room list
    useEffect(() => {
        async function fetchData() {
            if (hostelId) {
                if (admin === "student") {
                    const token = localStorage.getItem("studenttoken")
                    const response = await StudentRoomList(token, hostelId)
                    if (response && response.status === "success") {
                        setRooms(response.rooms)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    const token = localStorage.getItem("parenttoken")
                    console.log(token);
                    const response = await ParentRoomList(token, hostelId)
                    if (response && response.status === "success") {
                        setRooms(response.rooms)
                    } else {
                        alert(response?.message)
                    }
                }
            }
        }
        fetchData()
    }, [hostelId]);

    // return
    return (
        <>
            <NavbarComponent now={'home'} />
            <div className="w-auto min-h-screen px-3 pt-16 bg-[#1B263B]">
                <div className="w-full min-h-screen rounded-lg px-5 py-5 mt-3 bg-gray-400">
                    <div className="w-full p-5">
                        {/* Room list */}
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
                            {rooms.map((item, index) => (
                                <div key={index} className="flex flex-row border p-4 rounded-lg shadow-xl shadow-inner bg-gray-100">
                                    <img
                                        src={item.image.path}
                                        alt="Example"
                                        className="rounded-md shadow-lg w-40 h-25"
                                    />
                                    <div className="ml-5">
                                        <h1 className="text-lg font-extrabold">
                                            Room No - {item.room_no} <span className="font-semibold">( {item.room_type} )</span>
                                        </h1>
                                        <h1 className="text-md font-bold mt-1">Vacancy - {item.availability}</h1>
                                        <h1 className="text-md font-bold mt-1">
                                            Facilities - <span className="font-semibold">{item.facilities.join(", ")}</span>
                                        </h1>
                                        <h1 className="text-xl font-extrabold mt-1">₹{item.price}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RoomsPage;