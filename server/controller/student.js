import Student from "../model/student-schema.js";
import Room from "../model/room-schema.js";
import Parent from "../model/parent-schema.js";
import { compare, hash } from "bcrypt";

//////////////////////////////////////////////////////  STUDENT  //////////////////////////////////////////////////////

export async function createStudent(req, res) {
    try {
        const { student_id, name, mobile_no, parent_mobile_no, room_no, age, gender, year, department, password } = req.body
        if (student_id != "" && name != "" && mobile_no != "" && parent_mobile_no != "" && room_no != "" && age != "" && gender != "" && year != "" && department != "" && password != "") {
            // room available or not checking
            const room = await Room.findOne({ room_no: room_no })
            if (!room?.availability) {
                res.json({ status: "failed", message: "Room not available" })
            } else {
                // student add
                const exist_student = await Student.findOne({ student_id: student_id })
                if (exist_student) {
                    res.json({ status: "failed", message: "This student_id already registered, please try login" })
                } else {
                    const pwd = await hash(password, 10)
                    await Student.create({ student_id, name, mobile_no, parent_mobile_no, room_no, age, gender, year, department, password: pwd })
                    const student = await Student.findOne({ student_id: student_id })
                    // room availability reducing
                    await Room.updateOne({ _id: room._id }, {
                        $set: {
                            availability: room.availability - 1
                        }
                    })
                    // parent add
                    if (student) {
                        req.body.password = await hash(password, 10)
                        await Parent.create({username: student_id, password: pwd})
                    }
                    res.json({ status: "success" })
                }
            }
        } else {
            res.json({ status: "failed", message: "Please enter your all details" })
        }
    } catch (error) {
        console.log(error);
        res.json({ status: "failed", message: "Code error" })
    }
}

// export async function detailsStudent(req, res) {
//     try {
//         const student = await Student.findById(req.query._id)
//         res.json({ status: "success", student })
//     } catch (error) {
//         res.json({ status: "failed", message: "Code error" })
//     }
// }

export async function listStudent(req, res) {
    try {
        const students = await Student.find().sort({ created_at: -1 })
        res.json({ status: "success", students })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function updateStudent(req, res) {
    try {
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
        res.json({ status: "failed", message: "Code error" })
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
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function deleteStudent(req, res) {
    try {
        const student = await Student.findById(req.query._id)
        if (student) {
            await Student.deleteOne({ _id: req.query._id })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This student not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}