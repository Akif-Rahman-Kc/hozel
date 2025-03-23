import { compare, hash } from "bcrypt";
import jwt from 'jsonwebtoken'
import Student from "../model/student-schema.js";
import Hostel from "../model/hostel-schema.js";
import Parent from "../model/parent-schema.js";
import Menu from "../model/menu-schema.js";

//////////////////////////////////////////////////////  STUDENT  //////////////////////////////////////////////////////

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
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function studentForgotPassword(req, res) {
    try {
        const { student_id, new_password } = req.body
        const student = await Student.findOne({ student_id: student_id })
        if (student) {
            const password = await hash(new_password, 10)
            await Student.updateOne({ _id: student._id }, {
                $set: {
                    password: password
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", auth: false, type: "studentId", message: "Your student id is incorrect" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
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
        res.json({ status: "failed", message: "Network error" })
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
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function parentAuth(req, res) {
    try {
        const parent_details = await Parent.findById(req.parentId)
        const student = await Student.findOne({ hostel_id: parent_details.hostel_id, student_id: parent_details.username })
        if (parent_details) {
            res.json({ status: "success", auth: true, parent_details: parent_details, student: student })
        } else {
            res.json({ status: "success", auth: false })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

//////////////////////////////////////////////////////  HOSTEL  //////////////////////////////////////////////////////

export async function hostelRegister(req, res) {
    try {
        const { warden_name, address, hostel_name, college_name, warden_mobile_no, username, password } = req.body
        const hostel = await Hostel.findOne({ username: username })
        if (hostel) {
            res.json({ status: "failed", message: "Already exist this username" })
        } else {
            const twentyFourHoursInSeconds = 24 * 60 * 60; // 24 Hours in seconds
            const pwd = await hash(password, 10)
            await Hostel.create({ warden_name, address, hostel_name, college_name, warden_mobile_no, username, password: pwd })
            const hostel = await Hostel.findOne({ username: username })
            const hostelId = hostel._id
            const token = jwt.sign({ hostelId }, process.env.JWT_SECRET_KEY, { expiresIn: twentyFourHoursInSeconds })
            ////// menus added for 7 days with null
            const datas = [
                {
                    "day":"Sunday",
                    "items":[
                        {
                            "type":"Breakfast",
                            "dishes":""
                        },
                        {
                            "type":"Lunch",
                            "dishes":""
                        },
                        {
                            "type":"Dinner",
                            "dishes":""
                        }
                    ]
                },
                {
                    "day":"Monday",
                    "items":[
                        {
                            "type":"Breakfast",
                            "dishes":""
                        },
                        {
                            "type":"Lunch",
                            "dishes":""
                        },
                        {
                            "type":"Dinner",
                            "dishes":""
                        }
                    ]
                },
                {
                    "day":"Tuesday",
                    "items":[
                        {
                            "type":"Breakfast",
                            "dishes":""
                        },
                        {
                            "type":"Lunch",
                            "dishes":""
                        },
                        {
                            "type":"Dinner",
                            "dishes":""
                        }
                    ]
                },
                {
                    "day":"Wednesday",
                    "items":[
                        {
                            "type":"Breakfast",
                            "dishes":""
                        },
                        {
                            "type":"Lunch",
                            "dishes":""
                        },
                        {
                            "type":"Dinner",
                            "dishes":""
                        }
                    ]
                },
                {
                    "day":"Thursday",
                    "items":[
                        {
                            "type":"Breakfast",
                            "dishes":""
                        },
                        {
                            "type":"Lunch",
                            "dishes":""
                        },
                        {
                            "type":"Dinner",
                            "dishes":""
                        }
                    ]
                },
                {
                    "day":"Friday",
                    "items":[
                        {
                            "type":"Breakfast",
                            "dishes":""
                        },
                        {
                            "type":"Lunch",
                            "dishes":""
                        },
                        {
                            "type":"Dinner",
                            "dishes":""
                        }
                    ]
                },
                {
                    "day":"Saturday",
                    "items":[
                        {
                            "type":"Breakfast",
                            "dishes":""
                        },
                        {
                            "type":"Lunch",
                            "dishes":""
                        },
                        {
                            "type":"Dinner",
                            "dishes":""
                        }
                    ]
                }
            ]
            for (const data of datas) {
                await Menu.create({hostel_id: hostelId, day: data.day, items: data.items});
            }
            //////
            res.json({ status: "success", auth: true, token: token })
        }
    } catch (error) {
        console.log(error);
        res.json({ status: "failed", message: "Network error" })
    }
}

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
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function hostelForgotPassword(req, res) {
    try {
        const { username, new_password } = req.body
        const hostel = await Hostel.findOne({ username: username })
        if (hostel) {
            const password = await hash(new_password, 10)
            await Hostel.updateOne({ _id: hostel._id }, {
                $set: {
                    password: password
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", auth: false, type: "username", message: "Your username is incorrect" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
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
        res.json({ status: "failed", message: "Network error" })
    }
}