import Parent from "../model/parent-schema.js";
import Student from "../model/student-schema.js";

//////////////////////////////////////////////////////  PARENT  //////////////////////////////////////////////////////

export async function listParent(req, res) {
    try {
        const hostel_id = req.hostelId ? req.hostelId : req.query.hostel_id
        const parents = await Parent.find({hostel_id: hostel_id}).sort({ created_at: -1 })
        let all_parents = []
        for (const parent of parents) {
            const student = await Student.findOne({ student_id: parent.username })
            all_parents.push({username: parent.username, student_name: student?.name, mobile_no: student?.parent_mobile_no})
        }
        res.json({ status: "success", parents: all_parents })
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}