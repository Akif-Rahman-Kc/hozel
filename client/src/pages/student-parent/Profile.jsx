import { useEffect, useState } from "react";
import NavbarComponent from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { StudentAuthApi, StudentProfileUpdate } from "../../apis/student";
import { ParentAuthApi } from "../../apis/parent";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfilePage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( hostel or parent or student)
    const admin = localStorage.getItem("admin")

    // states
    const [refresh, setRefresh] = useState(false)
    const [student, setStudent] = useState({})
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

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
                    setStudent(auth?.student_details)
                }
            } else {
                const token = localStorage.getItem("parenttoken")
                if (token) {
                    const auth = await ParentAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                    setStudent(auth?.student)
                }
            }
        }
        auth()
    }, [refresh]);

    // edit modal open
        const editModalOpen = () => {
            setFormData(student)
            setIsEditModalOpen(true)
        }
    
        // edit modal change
        const editModalChange = (e) => {
            const { name, type, value, files } = e.target;
            if (type === "file") {
                setFormData((prevData) => ({
                    ...prevData,
                    [name]: files && files[0] ? files[0] : null,
                }));
            } else {
                setFormData((prevData) => ({ ...prevData, [name]: value }));
            }
        };
    
        // edit modal submit
        const editModalSubmit = async (e) => {
            e.preventDefault();
            console.log("Form Data Submitted:", formData);
            const form = new FormData();
            form.append("_id", formData._id);
            form.append("image", formData.image);
            // form.append("name", formData.name);
            // form.append("mobile_no", formData.mobile_no);
            // form.append("address", formData.address);
            // form.append("age", formData.age);
            // form.append("gender", formData.gender);
            if (admin === "student") {
                const token = localStorage.getItem("studenttoken")
                if (token) {
                    const response = await StudentProfileUpdate(token, form)
                    if (response && response.status === "success") {
                        setRefresh(!refresh)
                        setFormData({})
                        setIsEditModalOpen(false)
                    } else {
                        alert(response?.message)
                    }
                } else {
                    alert("You cant edit profile, Please login first")
                }
            } else {
                alert("You dont have access to edit")
            }
        };

    // return
    return (
        <>
            <NavbarComponent now={'home'} />
            <div className="w-auto min-h-screen px-3 pt-16 bg-[#1B263B]">
                <div className="w-full min-h-screen rounded-lg px-5 py-5 mt-3 bg-gray-400">
                    <div className="w-full p-5">
                        <div className="flex-1 border p-4 rounded-lg shadow-xl shadow-inner bg-gray-100">
                            {
                                admin === "parent" &&
                                <h1 className="font-extrabold text-2xl underline text-center">Your Student Details</h1>
                            }
                            <div className="w-full mt-2">
                                <div className="flex justify-center">
                                    <img
                                        src={student?.image ? student?.image?.path : "https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"}
                                        alt="Example"
                                        className="rounded-full shadow-lg w-28"
                                    />
                                </div>
                                <h1 className="text-2xl text-center font-extrabold">{student?.name}</h1>
                                <h1 className="text-lg text-center font-bold">({student?.student_id})</h1>
                            </div>
                            <div className="w-full flex flex-col justify-center items-center gap-2 mb-2">
                                {
                                    admin === "student" &&
                                    <div className="w-full md:1/2 lg:w-2/5">
                                        <button onClick={editModalOpen} className="w-1/2 mt-2 border py-1 text-xxs font-extrabold rounded-lg shadow-xl shadow-inner bg-gray-400 hover:bg-gray-700 hover:text-white active:bg-gray-800">
                                            EDIT PROFILE
                                        </button>
                                        <button onClick={() => navigate("/change-password")} className="w-1/2 mt-2 border py-1 text-xxs font-extrabold rounded-lg shadow-xl shadow-inner bg-gray-400 hover:bg-gray-700 hover:text-white active:bg-gray-800">
                                            CHANGE PASSWORD
                                        </button>
                                    </div>
                                }
                                <div className="w-full md:1/2 lg:w-2/5 border px-10 py-4 rounded-lg shadow-xl shadow-inner bg-gray-300">
                                    <h1 className="text-md font-bold">Name : <span className="font-semibold ml-3">{student?.name}</span></h1>
                                    <h1 className="text-md font-bold">Mobile No : <span className="font-semibold ml-3">{student?.mobile_no}</span></h1>
                                    <h1 className="text-md font-bold">Parent Mobile No : <span className="font-semibold ml-3">{student?.parent_mobile_no}</span></h1>
                                    <h1 className="text-md font-bold">Address : <span className="font-semibold ml-3">{student?.address}</span></h1>
                                    <h1 className="text-md font-bold">Age : <span className="font-semibold ml-3">{student?.age}</span></h1>
                                    <h1 className="text-md font-bold">Gender : <span className="font-semibold ml-3">{student?.gender}</span></h1>
                                    <h1 className="text-md font-bold">Year : <span className="font-semibold ml-3">{student?.year}</span></h1>
                                    <h1 className="text-md font-bold">Department : <span className="font-semibold ml-3">{student?.department}</span></h1>
                                    <h1 className="text-md font-bold">Room No : <span className="font-semibold ml-3">{student?.room_no}</span></h1>
                                    <h1 className="text-md font-bold">College : <span className="font-semibold ml-3">{student?.college}</span></h1>
                                    <h1 className="text-md font-bold">Facalty Name : <span className="font-semibold ml-3">{student?.facalty_name}</span></h1>
                                    <h1 className="text-md font-bold">Facalty Mobile No : <span className="font-semibold ml-3">{student?.facalty_mobile_no}</span></h1>
                                    <h1 className="text-md font-bold">Hostel Mobile No : <span className="font-semibold ml-3">{student?.hostel_mobile_no}</span></h1>
                                </div>
                            </div>
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
                                        <h2 className="text-xl text-white text-center font-bold mb-4">Edit Prfile</h2>
                                        {/* form */}
                                        <form onSubmit={editModalSubmit}>
                                            {/* image field */}
                                            <div className="mb-4 flex justify-center relative">
                                                {console.log(formData)
                                                }
                                                {formData?.image ? (
                                                    <img
                                                        src={formData.image.path ? formData.image.path : URL.createObjectURL(formData.image)}
                                                        alt="Selected"
                                                        className="mt-1 object-cover rounded-full mb-3 w-28"
                                                    />
                                                ) : (
                                                    <img
                                                        src={"https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"}
                                                        alt="Selected"
                                                        className="mt-1 object-cover rounded-md mb-3 w-28 mix-blend-multiply"
                                                    />
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
                                                    className=" absolute top-20 shadow appearance-none bg-gray-600 leading-tight focus:outline-none focus:shadow-outline cursor-pointer hover:bg-gray-500 rounded-full block p-1.5 mt-2"
                                                >
                                                    <FontAwesomeIcon className="mx-1 cursor-pointer" icon={faPen} color="#6961ff" size="sm" />
                                                </label>
                                            </div>
                                            {/* name field */}
                                            {/* <div className="mb-4">
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
                                            </div> */}
                                            {/* mobile no field */}
                                            {/* <div className="mb-4">
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
                                            </div> */}
                                            {/* address no field */}
                                            {/* <div className="mb-4">
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
                                                    value={formData.address}
                                                    onChange={editModalChange}
                                                    required
                                                />
                                            </div> */}
                                            {/* age no field */}
                                            {/* <div className="mb-4">
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
                                            </div> */}
                                            {/* gender no field */}
                                            {/* <div className="mb-4">
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
                                            </div> */}

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
                </div>
            </div>
        </>
    );
}

export default ProfilePage;