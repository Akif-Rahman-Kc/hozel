import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faSquareCheck, faMessage } from "@fortawesome/free-solid-svg-icons";
import PopupAlert from "../../components/PopupAlert";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi, HostelEntryExitCreate, HostelEntryExitList, HostelEntryExitMarkEntry, HostelEntryExitMarkExit } from "../../apis/hostel";

const HostelEntryExitPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [refresh, setRefresh] = useState(false)
    const [entryexitrefresh, setEntryExitRefresh] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    const [entryexit, setEntryExit] = useState([])
    const [allEntryExit, setAllEntryExit] = useState([])

    // use effect for login or not checking
    useEffect(() => {
        async function auth() {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                if (token) {
                    const auth = await HostelAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/hostel/login")
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

    // use effect fetching students payment dues
    useEffect(() => {
        async function fetchData() {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                const response = await HostelEntryExitList(token)
                console.log(response, "==repso");
                
                if (response && response.status === "success") {
                    setEntryExit(response.students)
                    setAllEntryExit(response.students)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [entryexitrefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log('Refreshed');
    }, [refresh]);

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_entryexits = allEntryExit.filter(entryexit => entryexit.name.toLowerCase().includes(lowercase_value) || entryexit.mobile_no.toLowerCase().includes(lowercase_value));
            setEntryExit(filterd_entryexits)
            setRefresh(!refresh)
        } else {
            setEntryExit(allEntryExit)
        }
    }

    // mark student exit
    const markStudentExit = async (student_id) => {
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            const form_data = {
                "student_id": student_id
            }
            const response = await HostelEntryExitMarkExit(token, form_data)
            if (response && response.status === "success") {
                setEntryExitRefresh(!entryexitrefresh)
            } else {
                alert(response?.message)
            }
        }
    }

    // mark student entry
    const markStudentEntry = async (student_id) => {
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            const form_data = {
                "student_id": student_id
            }
            const response = await HostelEntryExitMarkEntry(token, form_data)
            if (response && response.status === "success") {
                setEntryExitRefresh(!entryexitrefresh)
            } else {
                alert(response?.message)
            }
        }
    }

    const sendWhatsAppMessage = (mobile_no, student_name, timestamp, type) => {
        // time taking
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const this_date = `${day}/${month}/${year}`
        const this_time = `${hours}:${minutes}`
        // message
        let message
        if (type === "entry") {
            message = encodeURIComponent(`Dear Parent, we would like to inform you that ${student_name} has entered the hostel on ${this_date} at ${this_time}. Please contact us if you need any further details.`);
        } else {
            message = encodeURIComponent(`Dear Parent, we would like to inform you that ${student_name} exited the hostel on ${this_date} at ${this_time}. Please contact us if you need any further details.`);
        }
        window.open(`https://wa.me/+91${mobile_no}?text=${message}`, "_blank");
    };

    // timestamp foramat
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        // Extract the components
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Format as dd/mm/yyyy 00:00
        return `${day}/${month}/${year} - ${hours}:${minutes}`;
    };

    // return
    return (
        <>
            <NavbarComponent now={'entryexits'} />
            <SidebarComponent now={'entryexits'} />
            {/* Popup Alert Start */}
            {
                showAlert && (
                    <PopupAlert
                        message="Notification sent successfully."
                        type="success"
                        onClose={() => setShowAlert(false)}
                    />
                )
            }
            {/* Popup Alert End */}
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-[#1B263B]">
                <div className="w-full min-h-screen rounded-lg px-5 py-5 mt-3 bg-[#7b8794]">
                    {/* Filters */}
                    <div className="mb-3 flex w-full items-center">
                        {/* Search Bar Start */}
                        <div className="w-1/2 flex">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search..."
                                className="flex px-4 w-7/12 lg:w-4/12 py-1 bg-gray-200 border border-gray-800 rounded-lg text-black text-xs lg:text-sm"
                                // value={search}
                                onChange={(e) => search(e.target.value)}
                            />
                        </div>
                        {/* Search Bar End */}
                        <div className="w-1/2 flex justify-end"></div>
                    </div>
                    {/* Table */}
                    <div className="w-full bg-gray-300 overflow-x-auto rounded-xl">
                        <table className="w-full table-auto border-collapse border border-gray-900">
                            <thead>
                                <tr>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Name
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Mobile No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Parent Mobile No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Room No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Entry Time
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Exit Time
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Status
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Options
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {entryexit.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.name}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.mobile_no}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.parent_mobile_no}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.room_no}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {
                                                item.last_entry_time && item.next_button === "exit" ?
                                                <div className="flex justify-between items-center w-full">
                                                    {formatTimestamp(parseInt(item.last_entry_time))}
                                                    <FontAwesomeIcon onClick={() => sendWhatsAppMessage(item.parent_mobile_no, item.name, item.last_entry_time, "entry")} className="mt-1 ml-auto" icon={faMessage} color="#60A5FA" size="md" />
                                                </div>
                                                :
                                                <div className="w-full flex justify-center">
                                                    <button onClick={() => markStudentEntry(item.student_id)} className="px-2 py-1.5 text-xxs font-bold bg-green-700 text-white uppercase rounded-md">
                                                        Mark Entry
                                                    </button>
                                                </div>
                                            }
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {
                                                item.last_exit_time && item.next_button === "entry" ?
                                                <div className="flex justify-between items-center w-full">
                                                    {formatTimestamp(parseInt(item.last_exit_time))}
                                                    <FontAwesomeIcon onClick={() => sendWhatsAppMessage(item.parent_mobile_no, item.name, item.last_exit_time, "exit")} className="mt-1 ml-auto" icon={faMessage} color="#60A5FA" size="md" />
                                                </div>
                                                :
                                                <div className="w-full flex justify-center">
                                                    <button onClick={() => markStudentExit(item.student_id)} className="px-2 py-1.5 text-xxs font-bold bg-blue-700 text-white uppercase rounded-md">
                                                        Mark Exit
                                                    </button>
                                                </div>
                                            }
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.status}
                                        </td>
                                        <td className="border text-xs border-gray-500 w-1/12 px-4 py-2">
                                            <div className="w-full flex justify-center">
                                                <a href={`tel:+91${item.parent_mobile_no}`}><FontAwesomeIcon className="mt-1 mr-2" icon={faPhone} color="#60A5FA" size="md" /></a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table */}
                </div>
            </div>
        </>
    );
}

export default HostelEntryExitPage;