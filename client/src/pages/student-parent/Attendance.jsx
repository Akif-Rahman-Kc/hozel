import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StudentAuthApi, StudentCheckinMonthList, StudentCheckinYearList } from "../../apis/student";
import { ParentAuthApi, ParentCheckinMonthList, ParentCheckinYearList } from "../../apis/parent";


const AttendancePage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [monthAttendances, setMonthAttendances] = useState([])
    const [yearAttendances, setYearAttendances] = useState([])
    const [id, setId] = useState("")
    const [currentPage, setCurrentPage] = useState("month")

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
                    setId(auth?.student_details?._id)
                }
            } else {
                const token = localStorage.getItem("parenttoken")
                if (token) {
                    const auth = await ParentAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                    setId(auth?.student?._id)
                }
            }
        }
        auth()
    }, []);

    // use effect fetching month attendance list
    useEffect(() => {
        async function fetchData() {
            if (id) {
                if (admin === "student") {
                    const token = localStorage.getItem("studenttoken")
                    const response = await StudentCheckinMonthList(token, id)
                    console.log(response, "response");
                    if (response && response.status === "success") {
                        setMonthAttendances(response.checkins)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    const token = localStorage.getItem("parenttoken")
                    console.log(token);
                    const response = await ParentCheckinMonthList(token, id)
                    if (response && response.status === "success") {
                        setMonthAttendances(response.checkins)
                    } else {
                        alert(response?.message)
                    }
                }
            }
        }
        fetchData()
    }, [id]);

    // use effect fetching year attendance list
    useEffect(() => {
        async function fetchData() {
            if (id) {
                if (admin === "student") {
                    const token = localStorage.getItem("studenttoken")
                    const response = await StudentCheckinYearList(token, id)
                    if (response && response.status === "success") {
                        setYearAttendances(response.monthly_data)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    const token = localStorage.getItem("parenttoken")
                    console.log(token);
                    const response = await ParentCheckinYearList(token, id)
                    if (response && response.status === "success") {
                        setYearAttendances(response.monthly_data)
                    } else {
                        alert(response?.message)
                    }
                }
            }
        }
        fetchData()
    }, [id]);

    // timestamp foramat
    const formatTimestampForDate = (timestamp) => {
        const date = new Date(timestamp);

        // Extract the components
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        // Format as dd/mm/yyyy 00:00
        return `${day}/${month}/${year}`;
    };

    // timestamp foramat
    const formatTimestampForTime = (timestamp) => {
        const date = new Date(timestamp);

        // Extract the components
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Format as 00:00
        return `${hours}:${minutes}`;
    };

    // return
    return (
        <>
            <NavbarComponent now={'home'} />
            <div className="w-auto min-h-screen px-3 pt-16 bg-[#1B263B]">
                <div className="w-full min-h-screen rounded-lg px-5 py-5 mt-3 bg-gray-400">
                    <div className="w-full p-5">
                        <div className="flex flex-row space-x-20">
                            <div className={`${ currentPage === "month" && "border-b-4 border-[#1B263B]" }`}>
                                <h1 onClick={() => setCurrentPage("month")} className={`text-lg cursor-pointer ${ currentPage === "month" ? "font-extrabold" : "font-semibold" }`}>Current Month</h1>
                            </div>
                            <div className={`${ currentPage === "year" && "border-b-4  border-[#1B263B]" }`}>
                                <h1 onClick={() => setCurrentPage("year")} className={`text-lg cursor-pointer ${ currentPage === "year" ? "font-extrabold" : "font-semibold" }`}>Current Year</h1>
                            </div>
                        </div>
                        {/* Attendance Table list */}
                        {
                            currentPage === "month" ?
                            <div className="w-full shadow-xl shadow-inner bg-gray-100 overflow-x-auto rounded-xl mt-5">
                                <table className="w-full table-auto border-collapse border border-gray-900">
                                    <thead>
                                        <tr>
                                            <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                                Checkin Date
                                            </th>
                                            <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                                Checkin Time
                                            </th>
                                            <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthAttendances.map((item, index) => (
                                            <tr key={index}>
                                                <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                                    {formatTimestampForDate(parseInt(item.date))}
                                                </td>
                                                <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                                    {formatTimestampForTime(parseInt(item.checkin_time))}
                                                </td>
                                                <td className="border text-green-600 text-md font-semibold border-gray-500 px-4 py-2">
                                                    {item.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div className="w-full shadow-xl shadow-inner bg-gray-100 overflow-x-auto rounded-xl mt-5">
                                <table className="w-full table-auto border-collapse border border-gray-900">
                                    <thead>
                                        <tr>
                                            <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                                Month
                                            </th>
                                            <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                                Checkin Days
                                            </th>
                                            <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                                Rent
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {yearAttendances.map((item, index) => (
                                            <tr key={index}>
                                                <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                                    {item.month}
                                                </td>
                                                <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                                    {item.checkin_days}
                                                </td>
                                                <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                                    {item.payable_rent}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default AttendancePage;