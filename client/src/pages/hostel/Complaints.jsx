import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import Dropdown from "../../components/Dropdown";
import PopupAlert from "../../components/PopupAlert";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi, HostelComplaintList, HostelComplaintStatusUpdate } from "../../apis/hostel";


const HostelComplaintsPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [refresh, setRefresh] = useState(false)
    const [complaintRefresh, setComplaintRefresh] = useState(false)
    const [selectedValue, setSelectedValue] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [complaints, setComplaints] = useState([])
    const [allComplaints, setAllComplaints] = useState([])

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

    // use effect fetching complaint list
    useEffect(() => {
        async function fetchData() {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                const response = await HostelComplaintList(token)
                if (response && response.status === "success") {
                    setComplaints(response.complaints)
                    setAllComplaints(response.complaints)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [complaintRefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log('Refreshed');
    }, [refresh]);

    // status filtering
    useEffect(() => {
        if (selectedValue) {
            const filterd_complaints = allComplaints.filter(complaint => complaint.status.toLowerCase() === selectedValue.toLowerCase());
            setComplaints(filterd_complaints)
            setRefresh(!refresh)
        } else {
            setComplaints(allComplaints)
        }
    }, [selectedValue]);

    // status change
    const changeStatus = async (index, status) => {
        if (complaints[index].status === "RESOLVED" && status !== "RESOLVED") {
            triggerAlert()
        } else {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                if (token) {
                    const response = await HostelComplaintStatusUpdate(token, { _id: complaints[index]._id, status })
                    if (response && response.status === "success") {
                        setComplaintRefresh(!complaintRefresh)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    alert("You cant change complaint, Please login first")
                }
            } else {
                alert("You cannot change complaint details, you dont have access")   
            }
        }
    }

    // popup alert trigger
    const triggerAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Auto-close after 3 seconds
    };

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_complaints = allComplaints.filter(complaint => complaint.student_name.toLowerCase().includes(lowercase_value) || complaint.room_no.toLowerCase().includes(lowercase_value));
            setComplaints(filterd_complaints)
            setRefresh(!refresh)
        } else {
            setComplaints(allComplaints)
        }
    }

    // timestamp foramat
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);

        // Extract the components
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        // Format as dd/mm/yyyy 00:00
        return `${day}/${month}/${year}`;
    };

    // return
    return (
        <>
            <NavbarComponent now={'complaints'} />
            <SidebarComponent now={'complaints'} />
            {/* Popup Alert Start */}
            {
                showAlert && (
                    <PopupAlert
                        message="You cant change this status!"
                        type="error"
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
                        {/* Dropdown Start */}
                        <div className="w-1/2 flex justify-end">
                            <Dropdown key_name={"status"} items={["Pending", "In Progress", "Resolved"]} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
                        </div>
                        {/* Dropdown End */}
                    </div>
                    {/* Table */}
                    <div className="w-full bg-gray-300 overflow-x-auto rounded-xl">
                        <table className="w-full table-auto border-collapse border border-gray-900">
                            <thead>
                                <tr>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Complaint Description
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Complainted Student Name
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Complainted Room No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Complaint Time
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.description}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.student_name}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.room_no}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {formatTimestamp(parseInt(item.created_at))}
                                        </td>
                                        <td className={`border border-gray-500 px-4 py-2 text-center`}>
                                            {/* {item.status} */}
                                            <select className={`w-full text-xs font-extrabold bg-gray-300 capitalize p-2 rounded-md border border-gray-500 ${
                                                item.status === "PENDING" ?
                                                    "text-blue-600"
                                                :
                                                    item.status === "IN PROGRESS" ?
                                                        "text-orange-600"
                                                    :
                                                        "text-green-600"
                                            }`} name={"complaint_status"} id={"complaint_status"} value={item.status} onChange={(e) => changeStatus(index, e.target.value)}>
                                                {["PENDING", "IN PROGRESS", "RESOLVED"].map((item) => (
                                                    <option className="text-center font-bold" key={item} value={item}>{item}</option>
                                                ))}
                                            </select>
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

export default HostelComplaintsPage;