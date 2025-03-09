import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPhone, faSquareCheck, faMessage } from "@fortawesome/free-solid-svg-icons";
import PopupAlert from "../../components/PopupAlert";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi, HostelCheckinCreate, HostelCheckinList } from "../../apis/hostel";

const HostelCheckinPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [refresh, setRefresh] = useState(false)
    const [checkinrefresh, setCheckinRefresh] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [copiedOrderId, setCopiedOrderId] = useState(null);
    const [hoveredOrderId, setHoveredOrderId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [checkin, setCheckin] = useState([])
    const [allCheckin, setAllCheckin] = useState([])

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
                navigate('/landing')
            } 
        }
        auth()
    }, []);

    // use effect fetching students payment dues
    useEffect(() => {
        async function fetchData() {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                const response = await HostelCheckinList(token)
                if (response && response.status === "success") {
                    setCheckin(response.student_data)
                    setAllCheckin(response.student_data)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [checkinrefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log('Refreshed');
    }, [refresh]);

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_checkins = allCheckin.filter(payment_due => payment_due.student_name.toLowerCase().includes(lowercase_value) || payment_due.mobile_no.toLowerCase().includes(lowercase_value));
            setCheckin(filterd_checkins)
            setRefresh(!refresh)
        } else {
            setCheckin(allCheckin)
        }
    }

    // create checkin
    const checkIn = async (student_id, name, mobile_no) => {
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            const form_data = {
                "student_id": student_id,
                "student_name": name,
                "mobile_no": mobile_no,
                "checkin_time": Date.now()
            }
            const response = await HostelCheckinCreate(token, form_data)
            if (response && response.status === "success") {
                setCheckinRefresh(!checkinrefresh)
            } else {
                alert(response?.message)
            }
        }
    }

    const sendWhatsAppMessage = (mobile_no, student_name) => {
        const message = encodeURIComponent(`Dear Parent, we would like to inform you that ${student_name} has not checked into the hostel today. Please contact us if you need any further details.`);
        window.open(`https://wa.me/+91${mobile_no}?text=${message}`, "_blank");
    };

    // timestamp foramat
    const formatTimestamp = (timestamp) => {
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
            <NavbarComponent now={'checkins'} />
            <SidebarComponent now={'checkins'} />
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
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-gray-400">
                <div className="w-full min-h-screen px-5 py-5 mt-3">
                    {/* Filters */}
                    <div className="mb-3 flex w-full items-center">
                        {/* Search Bar Start */}
                        <div className="w-1/2 flex">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search..."
                                className="flex px-4 w-7/12 lg:w-4/12 py-1 bg-gray-200 border border-gray-800 rounded-md text-black text-xs lg:text-sm"
                                // value={search}
                                onChange={(e) => search(e.target.value)}
                            />
                        </div>
                        {/* Search Bar End */}
                        <div className="w-1/2 flex justify-end"></div>
                    </div>
                    {/* Table */}
                    <div className="w-full bg-gray-300 overflow-x-auto rounded-md">
                        <table className="w-full table-auto border-collapse border border-gray-900">
                            <thead>
                                <tr>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-gray-600 capitalize">
                                        Name
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-gray-600 capitalize">
                                        Mobile No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-gray-600 capitalize">
                                        Parent Mobile No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-gray-600 capitalize">
                                        Room No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-gray-600 capitalize">
                                        Checkin Days
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-gray-600 capitalize">
                                        Payable Rent
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-gray-600 capitalize">
                                        Today Checkin
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-gray-600 capitalize">
                                        Options
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {checkin.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-black text-sm text-md border-gray-500 px-4 py-2">
                                            {item.name}
                                        </td>
                                        <td className="border text-black text-sm text-md border-gray-500 px-4 py-2">
                                            {item.mobile_no}
                                        </td>
                                        <td className="border text-black text-sm text-md border-gray-500 px-4 py-2">
                                            {item.parent_mobile_no}
                                        </td>
                                        <td className="border text-black text-sm text-md border-gray-500 px-4 py-2">
                                            {item.room_no}
                                        </td>
                                        <td className="border text-black text-sm text-md border-gray-500 px-4 py-2">
                                            {item.checkin_days}
                                        </td>
                                        <td className="border text-black text-sm text-md border-gray-500 px-4 py-2">
                                            ₹{item.payable_rent}
                                        </td>
                                        <td className="border text-black text-sm text-md border-gray-500 px-4 py-2">
                                            {
                                                item.checkin_time ?
                                                formatTimestamp(parseInt(item.checkin_time))
                                                :
                                                <div className="w-full flex justify-center">
                                                    <FontAwesomeIcon onClick={() => checkIn(item.student_id, item.name, item.mobile_no)} className="mt-1 ml-2" icon={faSquareCheck} color="#0bb329" size="md" />
                                                </div>
                                            }
                                        </td>
                                        <td className="border text-xs border-gray-500 w-1/12 px-4 py-2">
                                            <div className="w-full flex justify-center">
                                                <a href="tel:+919562696976"><FontAwesomeIcon className="mt-1 mr-2" icon={faPhone} color="#60A5FA" size="md" /></a>
                                                <FontAwesomeIcon onClick={() => sendWhatsAppMessage(item.parent_mobile_no, item.name)} className="mt-1 ml-2" icon={faMessage} color="#60A5FA" size="md" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table */}
                    {/* View Modal Start */}
                    {isViewModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-700 p-6 rounded shadow-lg w-96 relative">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsViewModalOpen(false)}
                                >
                                    &times;
                                </button>
                                {/* model content */}
                                <h2 className="text-lg text-white font-bold text-center mb-2">Due Orders</h2>
                                {/* dues order items */}
                                <div className="bg-gray-800 rounded p-4 mb-3">
                                    <ul className="space-y-2">
                                        {selectedStudent?.due_orders?.map((item, index) => (
                                            <li key={index} className="flex justify-between text-gray-300 text-xs relative">
                                                <div className="flex items-center">
                                                    {/* popover container */}
                                                    <div className="relative">
                                                        {/* copy icon */}
                                                        <FontAwesomeIcon
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(item.order_id);
                                                                setCopiedOrderId(item.order_id); // set the copied order ID
                                                                setTimeout(() => setCopiedOrderId(null), 2000); // reset after 2 seconds
                                                            }}
                                                            onMouseEnter={() => setHoveredOrderId(item.order_id)} // show "Copy" on hover
                                                            onMouseLeave={() => setHoveredOrderId(null)} // hide "Copy" on leave
                                                            className="mr-1 hover:text-gray-500 active:text-gray-400 cursor-pointer"
                                                            icon={faCopy}
                                                            color="#4B5563"
                                                            size="md"
                                                        />
                                                        {/* popover box */}
                                                        {hoveredOrderId === item.order_id && !copiedOrderId && (
                                                            <div className="absolute -top-8 left-0 bg-gray-500 text-white text-xxs rounded-t-lg rounded-r-lg px-2 py-1 shadow-md">
                                                                Copy
                                                            </div>
                                                        )}
                                                        {copiedOrderId === item.order_id && (
                                                            <div className="absolute -top-8 left-0 bg-gray-500 text-white text-xxs rounded-t-lg rounded-r-lg px-2 py-1 shadow-md">
                                                                Copied
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span>ORDER_ID: #{item.order_id}</span>
                                                </div>
                                                <span>{item.order_total_amount}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* View Modal End */}
                </div>
            </div>
        </>
    );
}

export default HostelCheckinPage;