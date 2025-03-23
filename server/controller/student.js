import Student from "../model/student-schema.js";
import Room from "../model/room-schema.js";
import Parent from "../model/parent-schema.js";
import Hostel from "../model/hostel-schema.js";
import { compare, hash } from "bcrypt";
import {v2 as cloudinary} from 'cloudinary';

//////////////////////////////////////////////////////  STUDENT  //////////////////////////////////////////////////////

export async function createStudent(req, res) {
    try {
        const { student_id, name, mobile_no, parent_mobile_no, address, room_no, age, gender, year, department, college, facalty_name, facalty_mobile_no, password } = req.body
        if (student_id != "" && name != "" && mobile_no != "" && parent_mobile_no != "" && address != "" && room_no != "" && age != "" && gender != "" && year != "" && department != "" && college != "" && facalty_name != "" && facalty_mobile_no != "" && password != "") {
            // validation
            if (password.length < 8) {
                res.json({ status: "failed", message: "Password minimum 8 characters" })
                return "okay"
            }
            if (mobile_no.length != 10 || parent_mobile_no.length != 10 || facalty_mobile_no.length != 10) {
                res.json({ status: "failed", message: "Mobile number should be 10 digits" })
                return "okay"
            }
            // room available or not checking
            const room = await Room.findOne({ hostel_id: req.hostelId, room_no: room_no })
            if (!room?.availability) {
                res.json({ status: "failed", message: "Room not available" })
            } else {
                // student add
                const exist_student = await Student.findOne({ student_id: student_id })
                if (exist_student) {
                    res.json({ status: "failed", message: "This student_id already added, please try login" })
                } else {
                    const hostel = await Hostel.findById(req.hostelId)
                    const pwd = await hash(password, 10)
                    await Student.create({ hostel_id: req.hostelId, hostel_mobile_no: hostel.warden_mobile_no, student_id, name, mobile_no, parent_mobile_no, address, room_no, age, gender, year, department, college, facalty_name, facalty_mobile_no, password: pwd })
                    const student = await Student.findOne({ student_id: student_id })
                    // room availability reducing
                    room.occupants.push({student_id, student_name: name, department})
                    await Room.updateOne({ _id: room._id }, {
                        $set: {
                            availability: room.availability - 1,
                            occupants: room.occupants
                        }
                    })
                    // parent add
                    if (student) {
                        req.body.password = await hash(password, 10)
                        await Parent.create({hostel_id:req.hostelId, username: student_id, password: pwd})
                    }
                    res.json({ status: "success" })
                }
            }
        } else {
            res.json({ status: "failed", message: "Please enter your all details" })
        }
    } catch (error) {
        console.log(error);
        res.json({ status: "failed", message: "Network error" })
    }
}

// export async function detailsStudent(req, res) {
//     try {
//         const student = await Student.findById(req.query._id)
//         res.json({ status: "success", student })
//     } catch (error) {
//         res.json({ status: "failed", message: "Network error" })
//     }
// }

export async function listStudent(req, res) {
    try {
        const hostel_id = req.hostelId ? req.hostelId : req.query.hostel_id
        const students = await Student.find({hostel_id: hostel_id}).sort({ created_at: -1 })
        res.json({ status: "success", students })
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function updateStudent(req, res) {
    try {
        // validation
        if (req.body.mobile_no.length != 10 || req.body.parent_mobile_no.length != 10) {
            res.json({ status: "failed", message: "Mobile number should be 10 digits" })
            return "okay"
        }
        const student = await Student.findById(req.body._id)
        if (student) {
            await Student.updateOne({ _id: req.body._id }, {
                $set: {
                    name: req.body.name ? req.body.name : student.name,
                    mobile_no: req.body.mobile_no ? req.body.mobile_no : student.mobile_no,
                    parent_mobile_no: req.body.parent_mobile_no ? req.body.parent_mobile_no : student.parent_mobile_no,
                    age: req.body.age ? req.body.age : student.age,
                    gender: req.body.gender ? req.body.gender : student.gender,
                    year: req.body.year ? req.body.year : student.year,
                    department: req.body.department ? req.body.department : student.department
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This student not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function updateStudentProfile(req, res) {
    try {
        console.log(req.body, '==body');
        // validation
        // if (req.body.mobile_no.length != 10) {
        //     res.json({ status: "failed", message: "Mobile number should be 10 digits" })
        //     return "okay"
        // }
        const student = await Student.findById(req.body._id)
        if (student) {
            let image = null
            if (req.file) {
                if (req.file.size < 10485760) {
                    cloudinary.config({
                        cloud_name: process.env.CLOUD_NAME,
                        api_key: process.env.CLOUD_KEY,
                        api_secret: process.env.CLOUD_SECRET
                    });
                    const result = await cloudinary.uploader.upload(req.file.path)
                    if (student?.image?.public_id) {
                        await cloudinary.api.delete_resources([student.image.public_id], { type: 'upload', resource_type: 'image' })
                    }
                    image = {
                        public_id:result.public_id,
                        path:result.secure_url
                    }
                } else {
                    res.json({status:"failed", message:"FIle size is too heavy Pls select another File"})
                }
            }
            await Student.updateOne({ _id: req.body._id }, {
                $set: {
                    // name: req.body.name ? req.body.name : student.name,
                    // mobile_no: req.body.mobile_no ? req.body.mobile_no : student.mobile_no,
                    // address: req.body.address ? req.body.address : student.address,
                    // age: req.body.age ? req.body.age : student.age,
                    // gender: req.body.gender ? req.body.gender : student.gender,
                    image: image ? image : student.image,
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This student not exist" })
        }
    } catch (error) {
        console.log(error);
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function studentChangePassword(req, res) {
    try {
        const { old_password, new_password } = req.body
        const student = await Student.findOne({ _id: req.studentId })
        if (student) {
            const isMatch = await compare(old_password, student.password)
            if (isMatch) {
                const password = await hash(new_password, 10)
                await Student.updateOne({ _id: student._id }, {
                    $set: {
                        password: password
                    }
                })
                res.json({ status: "success" })
            } else {
                res.json({ status: "failed", auth: false, type: "oldPassword", message: "Your old password is incorrect" })
            }
        } else {
            res.json({ status: "failed", message: "Your not valid please logout and login" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function updateStudentStatus(req, res) {
    try {
        const student = await Student.findById(req.body._id)
        if (student) {
            await Student.updateOne({ _id: req.body._id }, {
                $set: {
                    status: req.body.status
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This student not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function deleteStudent(req, res) {
    try {
        const student = await Student.findById(req.query._id)
        if (student) {
            if (student?.image?.public_id) {
                cloudinary.config({
                    cloud_name: process.env.CLOUD_NAME, 
                    api_key: process.env.CLOUD_KEY, 
                    api_secret: process.env.CLOUD_SECRET
                });
                const result = await cloudinary.api.delete_resources([room.image.public_id], { type: 'upload', resource_type: 'image' })
                const deleted = Object.keys(result.deleted)[0]
                if (result.deleted[deleted] == 'deleted') {
                    await Student.deleteOne({ _id: req.query._id })
                    // remove parent also
                    await Parent.deleteOne({ username: student.student_id })
                    // room availability adding
                    const room = await Room.findOne({ hostel_id: req.hostelId, room_no: student?.room_no })
                    if (room) {
                        const occupants = room?.occupants?.filter(item => item.student_id !== student.student_id);
                        await Room.updateOne({ _id: room._id }, {
                            $set: {
                                availability: room.availability + 1,
                                occupants: occupants
                            }
                        })
                    }
                    res.json({ status: "success" })
                }else{
                    res.json({status:"failed", message:"File not deleted"})
                }
            } else {
                await Student.deleteOne({ _id: req.query._id })
                // remove parent also
                await Parent.deleteOne({ username: student.student_id })
                // room availability adding
                const room = await Room.findOne({ hostel_id: req.hostelId, room_no: student?.room_no })
                if (room) {
                    const occupants = room?.occupants?.filter(item => item.student_id !== student.student_id);
                    await Room.updateOne({ _id: room._id }, {
                        $set: {
                            availability: room.availability + 1,
                            occupants: occupants
                        }
                    })
                }
                res.json({ status: "success" })
            }  
        } else {
            res.json({ status: "failed", message: "This student not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}