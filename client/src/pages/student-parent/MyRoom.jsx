import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StudentAuthApi, StudentRoomDetails } from "../../apis/student";
import { ParentAuthApi, ParentRoomDetails } from "../../apis/parent";


const MyRoomPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [myRoom, setMyRoom] = useState({})
    const [hostelId, setHostelId] = useState("")
    const [roomNo, setRoomNo] = useState("")
    const [studentId, setStudentId] = useState("")

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
                    setRoomNo(auth?.student_details?.room_no)
                    setStudentId(auth?.student_details?.student_id)
                }
            } else {
                const token = localStorage.getItem("parenttoken")
                if (token) {
                    const auth = await ParentAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                    setHostelId(auth?.parent_details?.hostel_id)
                    setRoomNo(auth?.student?.room_no)
                    setStudentId(auth?.student?.student_id)
                }
            }
        }
        auth()
    }, []);

    // use effect fetching my room details
    useEffect(() => {
        async function fetchData() {
            if (hostelId && roomNo) {
                if (admin === "student") {
                    const token = localStorage.getItem("studenttoken")
                    const response = await StudentRoomDetails(token, hostelId, roomNo)
                    if (response && response.status === "success") {
                        setMyRoom(response.room)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    const token = localStorage.getItem("parenttoken")
                    console.log(token);
                    const response = await ParentRoomDetails(token, hostelId, roomNo)
                    if (response && response.status === "success") {
                        setMyRoom(response.room)
                    } else {
                        alert(response?.message)
                    }
                }
            }
        }
        fetchData()
    }, [hostelId, roomNo]);

    // return
    return (
        <>
            <NavbarComponent now={'home'} />
            <div className="w-auto min-h-screen px-3 pt-16 bg-[#1B263B]">
                <div className="w-full min-h-screen rounded-lg px-5 py-5 mt-3 bg-gray-400">
                    <div className="w-full p-5">
                        <div className="flex-1 border p-4 rounded-lg shadow-xl shadow-inner bg-gray-100">
                            <div className="w-full mt-2">
                                <h1 className="text-2xl text-center font-extrabold">Room No - {myRoom?.room_no}</h1>
                                <h1 className="text-xl text-center font-bold">({myRoom?.room_type})</h1>
                                <div className="flex justify-center mt-2">
                                    <img
                                        src={myRoom?.image && myRoom?.image?.path}
                                        alt="Example"
                                        className="rounded-md shadow-lg w-48"
                                    />
                                </div>
                            </div>
                            <div className="w-full flex-1 justify-between md:flex-row md:flex">
                                <div className="w-full md:w-fit mt-9 border px-4 py-1 rounded-lg shadow-xl shadow-inner bg-gray-300 self-start">
                                    <h1 className="text-lg font-semibold">Room Capacity - {myRoom?.capacity}</h1>
                                </div>
                                <div className="w-full md:w-fit mt-9 border px-4 py-1 rounded-lg shadow-xl shadow-inner bg-gray-300 self-center">
                                    <h1 className="text-lg font-semibold">Facilities - {myRoom?.facilities && myRoom?.facilities.join(", ")}</h1>
                                </div>
                                <div className="w-full md:w-fit mt-9 border px-4 py-1 rounded-lg shadow-xl shadow-inner bg-gray-300 self-end">
                                    <h1 className="text-lg font-semibold">Availability - {myRoom?.availability}</h1>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 mt-8 mb-7">
                                {
                                    myRoom?.occupants && myRoom?.occupants?.length > 0 &&
                                    myRoom?.occupants?.map((item, index) => (
                                        <div key={index} className="flex flex-row border p-8 rounded-lg shadow-xl shadow-inner bg-gray-300">
                                            <div className="ml-5 w-full">
                                                {
                                                    studentId === item.student_id ?
                                                    <h1 className="text-xl font-bold">
                                                        Me
                                                    </h1>
                                                    :
                                                    <h1 className="text-xl font-bold">
                                                        {item.student_name}
                                                    </h1>
                                                }
                                                <h1 className="text-md font-bold mt-1">
                                                    Department - <span className="font-semibold capitalize">{item.department}</span>
                                                </h1>
                                                <h1 className="text-md font-bold mt-1">
                                                    Rent - <span className="font-extrabold capitalize">₹{myRoom?.price}</span>
                                                </h1>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyRoomPage;