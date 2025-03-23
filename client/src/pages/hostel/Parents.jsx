import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import SidebarComponent from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { HostelAuthApi, HostelParentList } from "../../apis/hostel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";


const HostelParentsPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    const [refresh, setRefresh] = useState(false)
    const [parents, setParents] = useState([])
    const [allParents, setAllParents] = useState([])

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

    // use effect fetching parent list
    useEffect(() => {
        async function fetchData() {
            if (admin === "hostel") {
                const token = localStorage.getItem("hosteltoken")
                const response = await HostelParentList(token)
                if (response && response.status === "success") {
                    setParents(response.parents)
                    setAllParents(response.parents)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, []);
    
    // use effect for refresh
    useEffect(() => {
        console.log('Refreshed');
    }, [refresh]);

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_parents = allParents.filter(parents => parents.username.toLowerCase().includes(lowercase_value) || parents.student_name.toLowerCase().includes(lowercase_value));
            setParents(filterd_parents)
            setRefresh(!refresh)
        } else {
            setParents(allParents)
        }
    }

    // return
    return (
        <>
            <NavbarComponent now={'parents'} />
            <SidebarComponent now={'parents'} />
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
                                        Username
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Student Name
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Mobile No
                                    </th>
                                    <th className="text-md text-white border border-gray-500 px-4 py-2 bg-[#1B263B] capitalize">
                                        Options
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {parents.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2 capitalize">
                                            {item.username}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.student_name}
                                        </td>
                                        <td className="border text-sm text-black text-md font-semibold border-gray-500 px-4 py-2">
                                            {item.mobile_no}
                                        </td>
                                        <td className="border text-xs border-gray-500 w-1/12 px-4 py-2">
                                            <div className="w-full flex justify-center">
                                                <a href={`tel:+91${item.mobile_no}`}><FontAwesomeIcon className="mt-1 mr-2" icon={faPhone} color="#60A5FA" size="md" /></a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table End */}
                </div>
            </div>
        </>
    );
}

export default HostelParentsPage;