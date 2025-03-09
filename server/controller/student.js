import Student from "../model/student-schema.js";

//////////////////////////////////////////////////////  STUDENT  //////////////////////////////////////////////////////

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