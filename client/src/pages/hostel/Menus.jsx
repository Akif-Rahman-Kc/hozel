import { useEffect, useState } from "react";
import { faEdit} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi, HostelMenuList, HostelMenuUpdate } from "../../apis/hostel";


const HostelMenusPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or menu)
    const admin = localStorage.getItem("admin")

    const [refresh, setRefresh] = useState(false)
    const [menuRefresh, setMenuRefresh] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [formData, setFormData] = useState({
        day: "",
        breakfast: "",
        lunch: "",
        dinner: ""
    });
    const [menus, setMenus] = useState([])
    const [allMenus, setAllMenus] = useState([])

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

    // use effect fetching menu list
    useEffect(() => {
        async function fetchData() {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                const response = await HostelMenuList(token)
                if (response && response.status === "success") {
                    setMenus(response.menus)
                    setAllMenus(response.menus)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [menuRefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log('Refreshed');
    }, [refresh]);

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_menus = allMenus.filter(menus => menus.day.toLowerCase().includes(lowercase_value));
            setMenus(filterd_menus)
            setRefresh(!refresh)
        } else {
            setMenus(allMenus)
        }
    }

    // edit modal open
    const editModalOpen = (index) => {
        setIndex(index)
        setIsEditModalOpen(true)
        setFormData({
            _id: menus[index]._id,
            day: menus[index].day,
            breakfast: menus[index].items[0].dishes,
            lunch: menus[index].items[1].dishes,
            dinner: menus[index].items[2].dishes
        });
    }

    // edit modal change
    const editModalChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // edit modal submit
    const editModalSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        const data = {
            _id: formData._id,
            items: [
                {
                    "type": "Breakfast",
                    "dishes": formData.breakfast
                },
                {
                    "type": "Lunch",
                    "dishes": formData.lunch
                },
                {
                    "type": "Dinner",
                    "dishes": formData.dinner
                }
            ]
        }
        if (admin === "hostel") {
            const token = localStorage.getItem("hosteltoken")
            if (token) {
                const response = await HostelMenuUpdate(token, data)
                if (response && response.status === "success") {
                    setMenuRefresh(!menuRefresh)
                    setIsEditModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant edit menu, Please login first")
            }
        }
    };

    // return
    return (
        <>
            <NavbarComponent now={'menus'} />
            <SidebarComponent now={'menus'} />
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
                        <div className="w-1/2 flex justify-end"></div>
                    </div>
                    {/* Table Start */}
                    <div className="w-full bg-gray-300 overflow-x-auto rounded-xl">
                        <table className="w-full table-auto border-collapse border border-gray-900">
                            <thead>
                                <tr>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Day
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Breakfast
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Lunch
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Dinner
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Options
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {menus.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2 capitalize">
                                            {item.day}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2 capitalize">
                                            {item?.items[0]?.dishes}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item?.items[1]?.dishes}
                                        </td>
                                        <td className="border text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item?.items[2]?.dishes}
                                        </td>
                                        <td className="border text-xs border-gray-500 w-1/12 px-4 py-2">
                                            <div className="w-full flex justify-center">
                                                <FontAwesomeIcon className="mt-1 mr-2 cursor-pointer" onClick={() => editModalOpen(index)} icon={faEdit} color="#6961ff" size="md" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table End */}
                    {/* Edit Modal Start */}
                    {isEditModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-[#1B263B] bg-opacity-50">
                            <div className="bg-[#1B263B] p-6 rounded-lg shadow-lg w-96 relative">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    &times;
                                </button>

                                {/* modal content */}
                                <h2 className="text-xl text-white text-center font-bold mb-4">{"Edit " + formData.day + " Menu"}</h2>
                                {/* form */}
                                <form onSubmit={editModalSubmit}>
                                    {/* breakfast field */}
                                    <div className="mb-4">
                                        <label htmlFor="breakfast" className="block text-sm font-medium text-gray-300">
                                            Breakfast
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="breakfast"
                                            name="breakfast"
                                            placeholder="Enter breakfast"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.breakfast}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* lunch field */}
                                    <div className="mb-4">
                                        <label htmlFor="lunch" className="block text-sm font-medium text-gray-300">
                                            Lunch
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="lunch"
                                            name="lunch"
                                            placeholder="Enter lunch"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.lunch}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* dinner field */}
                                    <div className="mb-4">
                                        <label htmlFor="dinner" className="block text-sm font-medium text-gray-300">
                                            Dinner
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="dinner"
                                            name="dinner"
                                            placeholder="Enter dinner"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.dinner}
                                            onChange={editModalChange}
                                            required
                                        />
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
                </div>
            </div>
        </>
    );
}

export default HostelMenusPage;