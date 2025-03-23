import { useEffect, useState } from "react";
import { faEdit, faTrash, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import FilterDropdown from "../../components/FilterDropdown";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi, HostelStudentCreate, HostelStudentDelete, HostelStudentList, HostelStudentStatusUpdate, HostelStudentUpdate } from "../../apis/hostel";


const HostelStudentsPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    const [refresh, setRefresh] = useState(false)
    const [studentRefresh, setStudentRefresh] = useState(false)
    const [selectedValue, setSelectedValue] = useState({department: "", year: "", gender: "", status: ""});
    const [showFilter, setShowFilter] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [addData, setAddData] = useState({})
    const [formData, setFormData] = useState({
        name: "",
        mobile_no: "",
        parent_mobile_no: "",
        age: "",
        gender: ""
    });
    const [students, setStudents] = useState([])
    const [allStudents, setAllStudents] = useState([])

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

    // use effect fetching student list
    useEffect(() => {
        async function fetchData() {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                const response = await HostelStudentList(token)
                if (response && response.status === "success") {
                    setStudents(response.students)
                    setAllStudents(response.students)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [studentRefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log('Refreshed');
    }, [refresh]);

    // status change
    const changeStatus = async (index, status) => {
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            if (token) {
                const response = await HostelStudentStatusUpdate(token, { _id: students[index]._id, status })
                if (response && response.status === "success") {
                    setStudentRefresh(!studentRefresh)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant change student, Please login first")
            }
        }
    }

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_students = allStudents.filter(students => students.name.toLowerCase().includes(lowercase_value) || students.mobile_no.toLowerCase().includes(lowercase_value));
            setStudents(filterd_students)
            setRefresh(!refresh)
        } else {
            setStudents(allStudents)
        }
    }

    // filter
    const filter = () => {
        const filterd_students = allStudents.filter(student => 
            (!selectedValue.department || student.department.toLowerCase() === selectedValue.department.toLowerCase()) &&
            (!selectedValue.year || student.year.toLowerCase() === selectedValue.year.toLowerCase()) &&
            (!selectedValue.gender || student.gender.toLowerCase() === selectedValue.gender.toLowerCase()) &&
            (!selectedValue.status || student.status.toLowerCase() === selectedValue.status.toLowerCase())
        );
        setStudents(filterd_students)
        setRefresh(!refresh)
        setShowFilter(false)
    }

    // clear
    const clear = () => {
        setStudents(allStudents)
        setSelectedValue({department: "", year: "", gender: "", status: ""})
        setRefresh(!refresh)
        setShowFilter(false)
    }

    // add modal open
    const addModalOpen = () => {
        setIsAddModalOpen(true)
    }

    // add modal change
    const addModalChange = (e) => {
        const { name, value } = e.target;
        if (value < 0) return;
        setAddData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // add modal submit
    const addModalSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", addData);
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            if (token) {
                const response = await HostelStudentCreate(token, addData)
                if (response && response.status === "success") {
                    setStudentRefresh(!studentRefresh)
                    setIsAddModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant add student, Please login first")
            }
        }
    };

    // edit modal open
    const editModalOpen = (index) => {
        setIndex(index)
        setIsEditModalOpen(true)
        setFormData(students[index]);
    }

    // edit modal change
    const editModalChange = (e) => {
        const { name, value } = e.target;
        if (value < 0) return;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // edit modal submit
    const editModalSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            if (token) {
                const response = await HostelStudentUpdate(token, formData)
                if (response && response.status === "success") {
                    setStudentRefresh(!studentRefresh)
                    setIsEditModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant edit student, Please login first")
            }
        }
    };

    // delete modal open
    const deleteModalOpen = (index) => {
        setIndex(index)
        setIsDeleteModalOpen(true)
    }

    // edit modal confirm
    const deleteModalConfirm = async () => {
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            if (token) {
                const response = await HostelStudentDelete(token, students[index]._id)
                if (response && response.status === "success") {
                    setStudentRefresh(!studentRefresh)
                    setIsDeleteModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant delete student, Please login first")
            }
        }
    };

    // return
    return (
        <>
            <NavbarComponent now={'students'} />
            <SidebarComponent now={'students'} />
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-[#1B263B]">
                <div className="w-full min-h-screen rounded-lg px-5 py-5 mt-3 bg-[#7b8794]">
                    {/* Filters */}
                    <div className="mb-3 flex w-full items-center relative">
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
                        {/* Filter Box Button Start */}
                        <div className="w-1/2 flex justify-end">    
                            {
                                showFilter ?
                                <button onClick={() => setShowFilter(false)} className="mt-4 mb-2 text-gray-800 hover:text-black text-xs rounded font-bold capitalize">
                                    Hide Filters
                                    <FontAwesomeIcon className="ml-1 hover:text-black" icon={faAngleUp} color="#222222" size="md" />
                                </button>
                                :
                                <button onClick={() => setShowFilter(true)} className="mt-4 mb-2 text-gray-800 hover:text-black text-xs rounded font-bold capitalize">
                                    Show Filters
                                    <FontAwesomeIcon className="ml-1 hover:text-black" icon={faAngleDown} color="#222222" size="md" />
                                </button>
                            }
                        </div>
                        {/* Filter Box Button End */}
                        {/* Filter box Start */}
                        {
                            showFilter &&
                            <div className="absolute top-10 left-0 w-full bg-gray-200 border border-gray-500 z-40 rounded-md">
                                <div className="w-full p-4">
                                    {/* content inside the filter box */}
                                    {/* dropdown */}
                                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <FilterDropdown key_name={"department"} items={["Mechanical", "Electronics", "Computer", "Civil"]} selectedValue={selectedValue.department} setSelectedValue={setSelectedValue} />
                                        <FilterDropdown key_name={"year"} items={["First", "Second", "Third", "Fourth"]} selectedValue={selectedValue.year} setSelectedValue={setSelectedValue} />
                                        <FilterDropdown key_name={"gender"} items={["male", "female", "other"]} selectedValue={selectedValue.gender} setSelectedValue={setSelectedValue} />
                                        <FilterDropdown key_name={"status"} items={["Active", "Inactive"]} selectedValue={selectedValue.status} setSelectedValue={setSelectedValue} />
                                    </div>
                                    {/* button */}
                                    <div className="flex justify-center mt-4">
                                        <button onClick={filter} className="mr-1 border-2 border-blue-800 text-blue-800 hover:text-white px-8 py-1.5 text-xxs rounded font-bold uppercase hover:bg-blue-800 active:bg-blue-900">
                                            Search
                                        </button>
                                        <button onClick={clear} className="ml-1 border-2 border-red-800 text-red-800 hover:text-white px-8 py-1.5 text-xxs rounded font-bold uppercase hover:bg-red-800 active:bg-red-900">
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* Filter box End */}
                    </div>
                    {/* Add Room Start */}
                    <div className={`w-full flex justify-center ${showFilter ? "mt-96 sm:mt-56 lg:mt-36" : ""}`}>
                        <button onClick={addModalOpen} className="w-full mb-2 text-white py-2 text-xxs font-extrabold uppercase rounded-lg bg-green-800 hover:bg-green-900">
                            Add Student
                        </button>
                    </div>
                    {/* Add Room End */}
                    {/* Table Start */}
                    <div className="w-full bg-gray-300 overflow-x-auto rounded-xl custom-scrollbar">
                        <table className="w-full table-auto border-collapse border border-gray-900">
                            <thead>
                                <tr>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Image
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Student ID
                                    </th>
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
                                        Address
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Room No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Age
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Gender
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Year
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Department
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        College
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Facalty Name
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Facalty Mobile No
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
                                {students.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            <img src={item?.image?.path ? item.image.path : "https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"} alt="Example" className="rounded-full shadow-lg h-9" />
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2 capitalize">
                                            #{item.student_id}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2 capitalize">
                                            {item.name}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.mobile_no}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.parent_mobile_no}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.address}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.room_no}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.age}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.gender}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.year}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.department}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.college}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.facalty_name}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.facalty_mobile_no}
                                        </td>
                                        <td className="border text-black text-xs border-gray-500 px-4 py-2">
                                            <div className="w-full flex justify-center">
                                                {
                                                    <div onClick={() => changeStatus(index, item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")} className="w-20 bg-gray-600 rounded-full shadow-md shadow-inner">
                                                        {
                                                            item.status === "ACTIVE" ?
                                                                <div className="flex w-14 py-1 bg-green-700 rounded-full text-white font-bold ml-auto justify-center status-box cursor-pointer">
                                                                    {item.status}
                                                                </div>
                                                                :
                                                                <div className="flex w-14 py-1 bg-red-600 rounded-full text-white font-bold justify-center status-box cursor-pointer">
                                                                    {item.status}
                                                                </div>
                                                        }
                                                    </div>
                                                }
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
                    {/* Table End */}
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
                                    {/* student_id field */}
                                    <div className="mb-2">
                                        <label htmlFor="student_id" className="block text-sm font-medium text-gray-300">
                                            Student ID
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="student_id"
                                            name="student_id"
                                            placeholder="Enter student id"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.student_id}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* name field */}
                                    <div className="mb-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                            Name
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Enter name"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.name}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* mobile_no field */}
                                    <div className="mb-2">
                                        <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-300">
                                            Mobile No
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            maxLength={10}
                                            id="mobile_no"
                                            name="mobile_no"
                                            placeholder="Enter mobile no"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.mobile_no}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* parent_mobile_no field */}
                                    <div className="mb-2">
                                        <label htmlFor="parent_mobile_no" className="block text-sm font-medium text-gray-300">
                                            Parent Mobile No ( Whatsapp No )
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            maxLength={10}
                                            id="parent_mobile_no"
                                            name="parent_mobile_no"
                                            placeholder="Enter parent mobile no"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.parent_mobile_no}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* address field */}
                                    <div className="mb-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                                            Address
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            placeholder="Enter address"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.address}
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
                                    {/* age field */}
                                    <div className="mb-2">
                                        <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                                            Age
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            maxLength={2}
                                            id="age"
                                            name="age"
                                            placeholder="Enter age"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.age}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* gender field */}
                                    <div className="mb-4">
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                                            Gender
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center mt-2">
                                            <label className="mr-4 text-sm text-gray-300 lowercase">
                                                <input
                                                    type="radio"
                                                    id="gender"
                                                    name="gender"
                                                    value="male"
                                                    checked={addData.gender === "male"}
                                                    onChange={addModalChange}
                                                    className="mr-1"
                                                />
                                                Male
                                            </label>
                                            <label className="mr-4 text-sm text-gray-300 lowercase">
                                                <input
                                                    type="radio"
                                                    id="gender"
                                                    name="gender"
                                                    value="female"
                                                    checked={addData.gender === "female"}
                                                    onChange={addModalChange}
                                                    className="mr-1"
                                                />
                                                Female
                                            </label>
                                            <label className="text-sm text-gray-300 lowercase">
                                                <input
                                                    type="radio"
                                                    id="gender"
                                                    name="gender"
                                                    value="other"
                                                    checked={addData.gender === "other"}
                                                    onChange={addModalChange}
                                                    className="mr-1"
                                                />
                                                Other
                                            </label>
                                        </div>
                                    </div>
                                    {/* year field */}
                                    <div className="mb-2">
                                        <label htmlFor="year" className="block text-sm font-medium text-gray-300">
                                            Year
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <select required className="w-full text-gray-300 text-sm bg-gray-900 capitalize px-2 py-1.5 rounded-md border border-gray-500" name={"year"} id={"year"} value={addData.year} onChange={addModalChange}>
                                            <option value="">Select year</option>
                                            {["First", "Second", "Third", "Fourth"].map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* department field */}
                                    <div className="mb-2">
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-300">
                                            Department
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <select required className="w-full text-gray-300 text-sm bg-gray-900 capitalize px-2 py-1.5 rounded-md border border-gray-500" name={"department"} id={"department"} value={addData.department} onChange={addModalChange}>
                                            <option value="">Select department</option>
                                            {["Mechanical", "Electronics", "Computer", "Civil"].map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* college field */}
                                    <div className="mb-2">
                                        <label htmlFor="college" className="block text-sm font-medium text-gray-300">
                                            College
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="college"
                                            name="college"
                                            placeholder="Enter college"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.college}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* facalty_name field */}
                                    <div className="mb-2">
                                        <label htmlFor="facalty_name" className="block text-sm font-medium text-gray-300">
                                            Facalty Name
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="facalty_name"
                                            name="facalty_name"
                                            placeholder="Enter facalty name"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.facalty_name}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* facalty_mobile_no field */}
                                    <div className="mb-2">
                                        <label htmlFor="facalty_mobile_no" className="block text-sm font-medium text-gray-300">
                                            Facalty Mobile No
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="facalty_mobile_no"
                                            name="facalty_mobile_no"
                                            placeholder="Enter facalty mobile no"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.facalty_mobile_no}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* password field */}
                                    <div className="mb-2">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                            Password
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="Enter password"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={addData.password}
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
                        <div className="fixed inset-0 flex items-center justify-center bg-[#1B263B] bg-opacity-50">
                            <div className="bg-[#1B263B] p-6 rounded-lg shadow-lg w-96 relative max-h-[72vh] overflow-y-auto custom-scrollbar">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    &times;
                                </button>

                                {/* modal content */}
                                <h2 className="text-xl text-white text-center font-bold mb-4">Edit Student</h2>
                                {/* form */}
                                <form onSubmit={editModalSubmit}>
                                    {/* name field */}
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                            Name
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Enter name"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.name}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* mobile no field */}
                                    <div className="mb-4">
                                        <label htmlFor="mobile_no" className="block text-sm font-medium text-gray-300">
                                            Mobile No
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            maxLength={10}
                                            id="mobile_no"
                                            name="mobile_no"
                                            placeholder="Enter mobile no"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.mobile_no}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* parent mobile no field */}
                                    <div className="mb-4">
                                        <label htmlFor="parent_mobile_no" className="block text-sm font-medium text-gray-300">
                                            Parent Mobile No
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            maxLength={10}
                                            id="parent_mobile_no"
                                            name="parent_mobile_no"
                                            placeholder="Enter parent mobile no"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.parent_mobile_no}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* age no field */}
                                    <div className="mb-4">
                                        <label htmlFor="age" className="block text-sm font-medium text-gray-300">
                                            Age
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            maxLength={2}
                                            id="age"
                                            name="age"
                                            placeholder="Enter age"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.age}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* gender no field */}
                                    <div className="mb-4">
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
                                            Gender
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center mt-2">
                                            <label className="mr-4 text-sm text-gray-300 lowercase">
                                                <input
                                                    type="radio"
                                                    id="gender"
                                                    name="gender"
                                                    value="male"
                                                    checked={formData.gender === "male"}
                                                    onChange={editModalChange}
                                                    className="mr-1"
                                                />
                                                Male
                                            </label>
                                            <label className="mr-4 text-sm text-gray-300 lowercase">
                                                <input
                                                    type="radio"
                                                    id="gender"
                                                    name="gender"
                                                    value="female"
                                                    checked={formData.gender === "female"}
                                                    onChange={editModalChange}
                                                    className="mr-1"
                                                />
                                                Female
                                            </label>
                                            <label className="text-sm text-gray-300 lowercase">
                                                <input
                                                    type="radio"
                                                    id="gender"
                                                    name="gender"
                                                    value="other"
                                                    checked={formData.gender === "other"}
                                                    onChange={editModalChange}
                                                    className="mr-1"
                                                />
                                                Other
                                            </label>
                                        </div>
                                    </div>

                                    {/* submit button */}
                                    <div className="flex justify-center mt-4">
                                        <button
                                            type="submit"
                                            className="mt-4 border-2 border-blue-500 text-blue-500 hover:text-white px-4 py-2 text-xxs rounded font-bold uppercase hover:bg-blue-500 active:bg-blue-600"
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
                                <p className="mb-7 text-sm text-gray-300">Do you want to delete this students data?</p>
                                {/* yes or no button */}
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="border-2 border-red-500 text-red-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-red-500 active:bg-red-600"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={deleteModalConfirm}
                                        className="border-2 border-green-500 text-green-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-green-500 active:bg-green-600"
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

export default HostelStudentsPage;