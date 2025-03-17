import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StudentAuthApi, StudentMenuList } from "../../apis/student";
import { ParentAuthApi, ParentMenuList } from "../../apis/parent";


const MenusPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [menus, setMenus] = useState([])
    const [hostelId, setHostelId] = useState("")

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

    // use effect fetching menu list
    useEffect(() => {
        async function fetchData() {
            if (hostelId) {
                if (admin === "student") {
                    const token = localStorage.getItem("studenttoken")
                    const response = await StudentMenuList(token, hostelId)
                    if (response && response.status === "success") {
                        setMenus(response.menus)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    const token = localStorage.getItem("parenttoken")
                    console.log(token);
                    const response = await ParentMenuList(token, hostelId)
                    if (response && response.status === "success") {
                        setMenus(response.menus)
                    } else {
                        alert(response?.message)
                    }
                }
            }
        }
        fetchData()
    }, [hostelId]);

    // return
    return (
        <>
            <NavbarComponent now={'home'} />
            <div className="w-auto min-h-screen px-3 pt-16 bg-[#1B263B]">
                <div className="w-full min-h-screen rounded-lg px-5 py-5 mt-3 bg-gray-400">
                    <div className="w-full p-5">
                        {/* Menu list */}
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
                            {menus.map((item, index) => (
                                <div key={index} className="flex flex-row border p-4 rounded-lg shadow-xl shadow-inner bg-gray-100">
                                    <div className="ml-5 w-full">
                                        <h1 className="text-xl font-extrabold text-center">
                                            {item.day}
                                        </h1>
                                        <h1 className="text-md font-bold mt-2">
                                            Breakfast - <span className="font-semibold capitalize">{item?.items[0]?.dishes}</span>
                                        </h1>
                                        <h1 className="text-md font-bold mt-1">
                                            Lunch - <span className="font-semibold capitalize">{item?.items[1]?.dishes}</span>
                                        </h1>
                                        <h1 className="text-md font-bold mt-1">
                                            Dinner - <span className="font-semibold capitalize">{item?.items[2]?.dishes}</span>
                                        </h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MenusPage;