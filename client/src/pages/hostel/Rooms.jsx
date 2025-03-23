import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../../components/Dropdown";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi, HostelRoomCreate, HostelRoomDelete, HostelRoomList, HostelRoomStatusUpdate, HostelRoomUpdate } from "../../apis/hostel";


const HostelRoomsPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [refresh, setRefresh] = useState(false)
    const [roomRefresh, setRoomRefresh] = useState(false)
    const [selectedValue, setSelectedValue] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [formData, setFormData] = useState({
        image: "",
        room_no: "",
        room_type: "",
        capacity: "",
        facilities: [],
        price: ""
    })
    const [rooms, setRooms] = useState([])
    const [allRooms, setAllRooms] = useState([])

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

    // use effect fetching room list
    useEffect(() => {
        async function fetchData() {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                const response = await HostelRoomList(token)
                if (response && response.status === "success") {
                    setRooms(response.rooms)
                    setAllRooms(response.rooms)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [roomRefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log("Refresh");
    }, [refresh]);

    // category filtering
    useEffect(() => {
        if (selectedValue) {
            const filterd_rooms = allRooms.filter(room => room.room_type.toLowerCase() === selectedValue.toLowerCase());
            setRooms(filterd_rooms)
            setRefresh(!refresh)
        } else {
            setRooms(allRooms)
        }
    }, [selectedValue]);

    // status change
    const changeStatus = async (index, status) => {
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            if (token) {
                const response = await HostelRoomStatusUpdate(token, { _id: rooms[index]._id })
                if (response && response.status === "success") {
                    setRoomRefresh(!roomRefresh)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant change room, Please login first")
            }
        } else {
            alert("You cannot change room details, you dont have access")   
        }
    }

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_rooms = allRooms.filter(room => room.room_no.toLowerCase().includes(lowercase_value));
            setRooms(filterd_rooms)
            setRefresh(!refresh)
        } else {
            setRooms(allRooms)
        }
    }

    // add modal open
    const addModalOpen = () => {
        setIsAddModalOpen(true)
        setFormData({
            image: "",
            room_no: "",
            room_type: "",
            capacity: "",
            facilities: [],
            price: ""
        });
    }

    // add modal change
    const addModalChange = (e) => {
        const { name, type, value, files, checked } = e.target;
        if (type === "file") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files && files[0] ? files[0] : null,
            }));
        } else {
            if (value < 0) return;
            if (name === "facilities") {
                setFormData((prevData) => ({
                    ...prevData,
                    facilities: checked
                        ? [...prevData.facilities, value] // Add to array if checked
                        : prevData.facilities.filter((facility) => facility !== value) // Remove if unchecked
                }));
            } else {
                setFormData((prevData) => ({ ...prevData, [name]: value }));
            }
        }
    };

    // add modal submit
    const addModalSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        const form = new FormData();
        form.append("image", formData.image);
        form.append("room_no", formData.room_no);
        form.append("room_type", formData.room_type);
        form.append("capacity", formData.capacity);
        form.append("facilities", formData?.facilities.length > 0 ? formData.facilities : "Nothing");
        form.append("price", formData.price);
        console.log(form);
        
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            if (token) {
                const response = await HostelRoomCreate(token, form)
                console.log(response);
                
                if (response && response.status === "success") {
                    setRoomRefresh(!roomRefresh)
                    setIsAddModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant add room, Please login first")
            }
        } else {
            alert("You cannot add room details, you dont have access")   
        }
    };

    // edit modal open
    const editModalOpen = (index) => {
        setIndex(index)
        setIsEditModalOpen(true)
        setFormData(rooms[index]);
    }

    // edit modal change
    const editModalChange = (e) => {
        const { name, type, value, files, checked } = e.target;
        if (type === "file") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files && files[0] ? files[0] : null,
            }));
        } else {
            if (value < 0) return;
            if (name === "facilities") {
                setFormData((prevData) => ({
                    ...prevData,
                    facilities: checked
                        ? [...prevData.facilities, value] // Add to array if checked
                        : prevData.facilities.filter((facility) => facility !== value) // Remove if unchecked
                }));
            } else {
                setFormData((prevData) => ({ ...prevData, [name]: value }));
            }
        }
    };

    // edit modal submit
    const editModalSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        const form = new FormData();
        form.append("_id", formData._id);
        form.append("image", formData.image);
        form.append("room_no", formData.room_no);
        form.append("room_type", formData.room_type);
        form.append("capacity", formData.capacity);
        form.append("facilities", formData.facilities);
        form.append("price", formData.price);
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            if (token) {
                const response = await HostelRoomUpdate(token, form)
                if (response && response.status === "success") {
                    setRoomRefresh(!roomRefresh)
                    setIsEditModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant edit room, Please login first")
            }
        } else {
            alert("You cannot edit room details, you dont have access")   
        }
    };

    // delete modal open
    const deleteModalOpen = (index) => {
        setIndex(index)
        setIsDeleteModalOpen(true)
    }

    // delete modal confirm
    const deleteModalConfirm = async () => {
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            if (token) {
                const response = await HostelRoomDelete(token, rooms[index]._id)
                if (response && response.status === "success") {
                    setRoomRefresh(!roomRefresh)
                    setIsDeleteModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant delete room, Please login first")
            }
        } else {
            alert("You cannot delete room details, you dont have access")   
        }
    };

    // return
    return (
        <>
            <NavbarComponent now={'rooms'} />
            <SidebarComponent now={'rooms'} />
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
                            <Dropdown key_name={"room type"} items={["Single", "Double", "Triple", "Dormitory"]} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
                        </div>
                        {/* Dropdown End */}
                    </div>
                    {/* Add Room Start */}
                    <div className="w-full flex justify-center">
                        <button onClick={addModalOpen} className="w-full mb-2 text-white py-2 text-xxs font-extrabold uppercase rounded-lg bg-green-800 hover:bg-green-900">
                            Add Room
                        </button>
                    </div>
                    {/* Add Room End */}
                    {/* Table */}
                    <div className="w-full bg-gray-300 overflow-x-auto rounded-xl">
                        <table className="w-full table-auto border-collapse border border-gray-900">
                            <thead>
                                <tr>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Image
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Room No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Room Type
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Capacity
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Facilities
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Price
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Availability
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
                                {rooms.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            <img src={item.image.path} alt="Example" className="rounded-md shadow-lg h-9" />
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.room_no}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.room_type}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.capacity}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.facilities.join(", ")}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            ₹{item.price}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.availability}
                                        </td>
                                        <td className="border text-black text-xs border-gray-500 px-4 py-2">
                                            <div className="w-full flex justify-center">
                                                <div onClick={() => changeStatus(index, item.status === "OPEN" ? "CLOSE" : "OPEN")} className="w-20 bg-gray-600 rounded-full shadow-md shadow-inner">
                                                    {
                                                        item.status === "OPEN" ?
                                                            <div className="flex w-14 py-1 bg-green-700 rounded-full text-white font-bold ml-auto justify-center status-box cursor-pointer">
                                                                {item.status}
                                                            </div>
                                                            :
                                                            <div className="flex w-14 py-1 bg-red-600 rounded-full text-white font-bold justify-center status-box cursor-pointer">
                                                                {item.status}
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border text-xs border-gray-500 w-1/12 px-4 py-2">
                                            <div className="w-full flex justify-center">
                                                <FontAwesomeIcon className="mt-1 mr-2 cursor-pointer" onClick={() => editModalOpen(index)} icon={faEdit} color="#6961ff" size="md" />
                                                <FontAwesomeIcon className="mt-1 ml-2 cursor-pointer" onClick={() => deleteModalOpen(index)} icon={faTrash} color="#f54242" size="md" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table */}
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
                                <h2 className="text-xl text-white text-center font-bold mb-2">Add Room</h2>
                                {/* form */}
                                <form onSubmit={addModalSubmit}>
                                    {/* image field */}
                                    <div className="mb-2">
                                        <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                                            Image
                                            <span className="text-red-500">*</span>
                                        </label>
                                        {formData?.image && (
                                            <img
                                                src={URL.createObjectURL(formData.image)}
                                                alt="Selected"
                                                className="mt-1 w-full object-cover rounded-md mb-3"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            className="hidden"
                                            onChange={addModalChange}
                                        />
                                        <label
                                            htmlFor="image"
                                            className="shadow appearance-none bg-gray-600 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5 cursor-pointer hover:bg-gray-500 mb-3 text-center block"
                                        >
                                            Choose Image
                                        </label>
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
                                            value={formData.room_no}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* room_type field */}
                                    <div className="mb-2">
                                        <label htmlFor="room_type" className="block text-sm font-medium text-gray-300">
                                            Room Type
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <select required className="w-full text-gray-300 text-sm bg-gray-900 capitalize px-2 py-1.5 rounded-md border border-gray-500" name={"room_type"} id={"room_type"} value={formData.room_type} onChange={addModalChange}>
                                            <option value="">Select room type</option>
                                            {["Single", "Double", "Triple", "Dormitory"].map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* capacity field */}
                                    <div className="mb-2">
                                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-300">
                                            Capacity
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="capacity"
                                            name="capacity"
                                            placeholder="Enter capacity"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.capacity}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* facilities field */}
                                    <div className="mb-2">
                                        <label htmlFor="facilities" className="block text-sm font-medium text-gray-300">
                                            Facilities
                                            <span className="text-red-500">*</span>
                                        </label>
                                        
                                        <div className="flex flex-row space-x-5 gap-2 mt-1">
                                            {["WiFi", "Laundry", "AC", "TV"].map((facility) => (
                                                <label key={facility} className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="facilities"
                                                        value={facility}
                                                        checked={formData.facilities.includes(facility)}
                                                        onChange={addModalChange}
                                                        className="form-checkbox text-blue-500 bg-gray-900 border-gray-500 focus:ring-blue-400"
                                                    />
                                                    <span className="ml-2 text-gray-300">{facility}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    {/* price field */}
                                    <div className="mb-2">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                                            Price
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            placeholder="Enter price"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.price}
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
                    {/* Add Modal End */}
                    {/* Edit Modal Start */}
                    {isEditModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-[#1B263B] bg-opacity-50 mt-3">
                            <div className="bg-[#1B263B] p-6 rounded-lg shadow-lg w-96 relative max-h-[72vh] overflow-y-auto custom-scrollbar">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    &times;
                                </button>

                                {/* modal content */}
                                <h2 className="text-xl text-white text-center font-bold mb-4">Edit Room</h2>
                                {/* form */}
                                <form onSubmit={editModalSubmit}>
                                    {/* image field */}
                                    <div className="mb-4">
                                        <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                                            Image
                                            <span className="text-red-500">*</span>
                                        </label>
                                        {console.log(formData)
                                        }
                                        {formData?.image ? (
                                            <img
                                                src={formData.image.path ? formData.image.path : URL.createObjectURL(formData.image)}
                                                alt="Selected"
                                                className="mt-1 w-full object-cover rounded-md mb-3"
                                            />
                                        ) : (
                                            <p className="text-gray-500 text-sm">No image selected</p>
                                        )}
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            className="hidden"
                                            onChange={editModalChange}
                                        />
                                        <label
                                            htmlFor="image"
                                            className="shadow appearance-none bg-gray-600 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5 cursor-pointer hover:bg-gray-500 mb-3 text-center block"
                                        >
                                            Change Image
                                        </label>
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
                                            value={formData.room_no}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* room_type field */}
                                    <div className="mb-2">
                                        <label htmlFor="room_type" className="block text-sm font-medium text-gray-300">
                                            Room Type
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <select required className="w-full text-gray-300 text-sm bg-gray-900 capitalize px-2 py-1.5 rounded-md border border-gray-500" name={"room_type"} id={"room_type"} value={formData.room_type} onChange={editModalChange}>
                                            <option value="">Select room type</option>
                                            {["Single", "Double", "Triple", "Dormitory"].map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* capacity field */}
                                    <div className="mb-2">
                                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-300">
                                            Capacity
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="capacity"
                                            name="capacity"
                                            placeholder="Enter capacity"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.capacity}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* facilities field */}
                                    <div className="mb-2">
                                        <label htmlFor="facilities" className="block text-sm font-medium text-gray-300">
                                            Facilities
                                            <span className="text-red-500">*</span>
                                        </label>
                                        
                                        <div className="flex flex-row space-x-5 gap-2 mt-1">
                                            {["WiFi", "Laundry", "AC", "TV"].map((facility) => (
                                                <label key={facility} className="inline-flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="facilities"
                                                        value={facility}
                                                        checked={formData.facilities.includes(facility)}
                                                        onChange={editModalChange}
                                                        className="form-checkbox text-blue-500 bg-gray-900 border-gray-500 focus:ring-blue-400"
                                                    />
                                                    <span className="ml-2 text-gray-300">{facility}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    {/* price no field */}
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                                            Price
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            placeholder="Enter price"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.price}
                                            onChange={editModalChange}
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
                    {/* Edit Modal End */}
                    {/* Delete Modal Start */}
                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 bg-[#1B263B] bg-opacity-50 flex justify-center items-center">
                            <div className="bg-[#1B263B] p-6 rounded shadow-lg w-96 relative">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    &times;
                                </button>
                                {/* model content */}
                                <h2 className="text-lg text-white font-bold mb-2">Are you sure?</h2>
                                <p className="mb-7 text-sm text-gray-300">Do you want to delete this room data?</p>
                                {/* yes or no button */}
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="border-2 border-red-500 text-red-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-red-500"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={deleteModalConfirm}
                                        className="border-2 border-green-500 text-green-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-green-500"
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Delete Modal End */}
                </div>
            </div>
        </>
    );
}

export default HostelRoomsPage;