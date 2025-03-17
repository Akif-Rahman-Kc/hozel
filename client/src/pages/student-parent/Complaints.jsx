import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StudentAuthApi, StudentComplaintCreate, StudentComplaintList } from "../../apis/student";
import { ParentAuthApi, ParentComplaintList } from "../../apis/parent";


const ComplaintsPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [complaints, setComplaints] = useState([])
    const [hostelId, setHostelId] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addData, setAddData] = useState({})
    const [refresh, setRefresh] = useState(false)

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

    // use effect fetching complaint list
    useEffect(() => {
        async function fetchData() {
            if (hostelId) {
                if (admin === "student") {
                    const token = localStorage.getItem("studenttoken")
                    const response = await StudentComplaintList(token, hostelId)
                    if (response && response.status === "success") {
                        setComplaints(response.complaints)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    const token = localStorage.getItem("parenttoken")
                    console.log(token);
                    const response = await ParentComplaintList(token, hostelId)
                    if (response && response.status === "success") {
                        setComplaints(response.complaints)
                    } else {
                        alert(response?.message)
                    }
                }
            } 
        }
        fetchData()
    }, [refresh, hostelId]);

    // add modal open
    const addModalOpen = () => {
        setIsAddModalOpen(true)
    }

    // add modal change
    const addModalChange = (e) => {
        const { name, value } = e.target;
        setAddData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // add modal submit
    const addModalSubmit = async (e) => {
        if (hostelId) {
            addData.hostel_id = hostelId
            e.preventDefault();
            console.log("Form Data Submitted:", addData);
            if (admin === "student") {
                const token = localStorage.getItem("studenttoken")
                if (token) {
                    const response = await StudentComplaintCreate(token, addData)
                    if (response && response.status === "success") {
                        setRefresh(!refresh)
                        setIsAddModalOpen(false)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    alert("You cant add complaint")
                }
            }
        } else {
            alert("Please refresh the page")
        }
    };

    // return
    return (
        <>
            <NavbarComponent now={'home'} />
            <div className="w-auto min-h-screen px-3 pt-16 bg-[#1B263B]">
                <div className="w-full min-h-screen rounded-lg px-5 py-5 mt-3 bg-gray-400">
                    <div className="w-full p-5">
                        {
                            admin === "student" &&
                            <div className="w-full">
                                <button onClick={addModalOpen} className="mb-3 text-white py-2 text-xxs font-extrabold uppercase rounded-lg bg-red-800 hover:bg-red-900 px-7">
                                    Complaint
                                </button>
                            </div>
                        }
                        {/* Complaint list */}
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
                            {complaints.map((item, index) => (
                                <div key={index} className="flex flex-row border p-4 rounded-lg shadow-xl shadow-inner bg-gray-100">
                                    <div className="ml-5 w-full">
                                        <h1 className="text-xl font-extrabold text-center">
                                            Complaint {index + 1}
                                        </h1>
                                        <h1 className="text-md font-bold mt-2"> Room No - {item?.room_no}</h1>
                                        <h1 className="text-md font-bold mt-1">
                                            Reason - <span className="font-semibold capitalize">{item?.description}</span>
                                        </h1>
                                        <h1 className={`text-lg font-extrabold mt-1 ${ item.status === "RESOLVED" ? "text-green-700" : item.status === "IN PROGRESS" ? "text-orange-600" : "text-blue-600" }`}>
                                            {item?.status}
                                        </h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Add Modal Start */}
                        {isAddModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-[#1B263B] bg-opacity-50 mt-3">
                                <div className="bg-[#1B263B] px-6 py-3 rounded-lg shadow-lg w-96 relative max-h-[72vh] overflow-y-auto custom-scrollbar">
                                    {/* close button */}
                                    <button
                                        className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                        onClick={() => setIsAddModalOpen(false)}
                                    >
                                        &times;
                                    </button>

                                    {/* modal content */}
                                    <h2 className="text-xl text-white text-center font-bold mb-2">Add Student</h2>
                                    {/* form */}
                                    <form onSubmit={addModalSubmit}>
                                        {/* student_name field */}
                                        <div className="mb-2">
                                            <label htmlFor="student_name" className="block text-sm font-medium text-gray-300">
                                                Student Name
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="student_name"
                                                name="student_name"
                                                placeholder="Enter student name"
                                                className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                                value={addData.student_name}
                                                onChange={addModalChange}
                                                required
                                            />
                                        </div>
                                        {/* room_no field */}
                                        <div className="mb-2">
                                            <label htmlFor="room_no" className="block text-sm font-medium text-gray-300">
                                                Room No
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="room_no"
                                                name="room_no"
                                                placeholder="Enter room no"
                                                className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                                value={addData.room_no}
                                                onChange={addModalChange}
                                                required
                                            />
                                        </div>
                                        {/* description field */}
                                        <div className="mb-2">
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                                                Reason
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="description"
                                                name="description"
                                                placeholder="Enter reason"
                                                className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                                value={addData.description}
                                                onChange={addModalChange}
                                                required
                                            />
                                        </div>

                                        {/* submit button */}
                                        <div className="flex justify-center mt-4">
                                            <button
                                                type="submit"
                                                className="mt-4 border-2 border-blue-500 text-blue-500 hover:text-white px-4 py-2 text-xxs rounded font-bold uppercase hover:bg-blue-500"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ComplaintsPage;