import { compare, hash } from "bcrypt";
import jwt from 'jsonwebtoken'
import Student from "../model/student-schema.js";
import Hostel from "../model/hostel-schema.js";
import Parent from "../model/parent-schema.js";

//////////////////////////////////////////////////////  STUDENT  //////////////////////////////////////////////////////

export async function studentRegister(req, res) {
    try {
        const { student_id, name, mobile_no, parent_mobile_no, room_no, age, gender, year, department, password, verify } = req.body
        if (student_id != "" && name != "" && mobile_no != "" && parent_mobile_no != "" && room_no != "" && age != "" && gender != "" && year != "" && department != "" && password != "") {
            if (verify) {
                const exist_student = await Student.findOne({ student_id: student_id })
                if (exist_student) {
                    res.json({ status: "failed", message: "This student_id already registered, please try login" })
                } else {
                    const fiftyYearsInSeconds = 50 * 365 * 24 * 60 * 60; // 50 years in seconds

                    const pwd = await hash(password, 10)
                    await Student.create({ student_id, name, mobile_no, parent_mobile_no, room_no, age, gender, year, department, password: pwd })
                    const student = await Student.findOne({ student_id: student_id })
                    if (student) {
                        req.body.password = await hash(password, 10)
                        await Parent.create({username: student_id, password: pwd})
                    }
                    const studentId = student._id
                    const token = jwt.sign({ studentId }, process.env.JWT_SECRET_KEY, { expiresIn: fiftyYearsInSeconds })
                    res.json({ status: "success", auth: true, token: token })
                }
            } else {
                res.json({ status: "failed", message: "You didnt verify your phone number" })
            }
        } else {
            res.json({ status: "failed", message: "Please enter your all details" })
        }
    } catch (error) {
        console.log(error);
        
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function studentLogin(req, res) {
    try {
        const { student_id, password } = req.body
        const student = await Student.findOne({ student_id: student_id })
        if (student) {
            if (student.status === "INACTIVE") {
                res.json({ auth: false, status: "failed", blocked: true, message: "Your account is Blocked!. Please contact support team" })
            } else {
                const isMatch = await compare(password, student.password)
                if (isMatch) {
                    const fiftyYearsInSeconds = 50 * 365 * 24 * 60 * 60; // 50 years in seconds
                    const studentId = student._id
                    const token = jwt.sign({ studentId }, process.env.JWT_SECRET_KEY, { expiresIn: fiftyYearsInSeconds })
                    res.json({ status: "success", auth: true, token: token })
                } else {
                    res.json({ status: "failed", auth: false, message: "Your password is incorrect" })
                }
            }
        } else {
            res.json({ status: "failed", auth: false, message: "Your mobile_no is incorrect" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function studentAuth(req, res) {
    try {
        const student_details = await Student.findById(req.studentId)
        if (student_details) {
            if (student_details.status === "INACTIVE") {
                res.json({ auth: false, status: "failed", blocked: true, message: "Your account is Blocked!. Please contact support team" })
            } else {
                res.json({ status: "success", auth: true, student_details: student_details })
            }
        } else {
            res.json({ status: "success", auth: false })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

//////////////////////////////////////////////////////  PARENT  //////////////////////////////////////////////////////

export async function parentLogin(req, res) {
    try {
        // req.body.password = await hash(req.body.password, 10)
        // req.body.created_at = Date.now()
        // await Parent.create(req.body)
        // res.json(true)

        const { username, password } = req.body
        const parent = await Parent.findOne({ username: username })
        if (parent) {
            const isMatch = await compare(password, parent.password)
            if (isMatch) {
                const parentId = parent._id
                const token = jwt.sign({ parentId }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 })
                res.json({ status: "success", auth: true, token: token })
            } else {
                res.json({ status: "failed", auth: false, type: "password", message: "Your password is incorrect" })
            }
        } else {
            res.json({ status: "failed", auth: false, type: "username", message: "Your username is incorrect" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function parentAuth(req, res) {
    try {
        const parent_details = await Parent.findById(req.parentId)
        if (parent_details) {
            res.json({ status: "success", auth: true })
        } else {
            res.json({ status: "success", auth: false })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

//////////////////////////////////////////////////////  HOSTEL  //////////////////////////////////////////////////////

export async function hostelLogin(req, res) {
    try {
        // req.body.password = await hash(req.body.password, 10)
        // req.body.created_at = Date.now()
        // await Hostel.create(req.body)
        // res.json(true)

        const { username, password } = req.body
        const hostel = await Hostel.findOne({ username: username })
        if (hostel) {
            const isMatch = await compare(password, hostel.password)
            if (isMatch) {
                const hostelId = hostel._id
                const token = jwt.sign({ hostelId }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 * 24 })
                res.json({ status: "success", auth: true, token: token, })
            } else {
                res.json({ status: "failed", auth: false, type: "password", message: "Your password is incorrect" })
            }
        } else {
            res.json({ status: "failed", auth: false, type: "username", message: "Your username is incorrect" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function hostelAuth(req, res) {
    try {
        const hostel_details = await Hostel.findById(req.hostelId)
        if (hostel_details) {
            res.json({ status: "success", auth: true })
        } else {
            res.json({ status: "success", auth: false })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}