import EntryExit from "../model/entryexit-schema.js";
import Student from "../model/student-schema.js";
import Room from "../model/room-schema.js";

//////////////////////////////////////////////////////  ENTRY EXIT  //////////////////////////////////////////////////////

export async function markExit(req, res) {
    try {
        const { student_id } = req.body;
        const hostel_id = req.hostelId
        if (hostel_id != "" && student_id != "") {
            const entryexit = await EntryExit.findOne({hostel_id, student_id})
            if (entryexit) {
                if (entryexit.status === "INSIDE") {
                    await EntryExit.updateOne({ _id: entryexit._id }, {
                        $set: {
                            exit_time: Date.now(),
                            status: "OUTSIDE"
                        }
                    })
                    res.json({ status: "success" });
                } else {
                    res.json({ status: "failed", message: "Student not found or already outside"});
                }
            } else {
                await EntryExit.create({ hostel_id, student_id, exit_time: Date.now(), status: "OUTSIDE" })
                res.json({ status: "success" });
            }
        } else {
            res.json({ status: "failed", message: "Please give full details of exit record"});
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}

export async function markEntry(req, res) {
    try {
        const { student_id } = req.body;
        const hostel_id = req.hostelId
        if (hostel_id != "" && student_id != "") {
            const entryexit = await EntryExit.findOne({hostel_id, student_id})
            if (entryexit) {
                if (entryexit.status === "OUTSIDE") {
                    await EntryExit.updateOne({ _id: entryexit._id }, {
                        $set: {
                            entry_time: Date.now(),
                            status: "INSIDE"
                        }
                    })
                    res.json({ status: "success" });
                } else {
                    res.json({ status: "failed", message: "Student not found or already inside"});
                }
            } else {
                await EntryExit.create({ hostel_id, student_id, entry_time: Date.now(), status: "INSIDE" })
                res.json({ status: "success" });
            }
        } else {
            res.json({ status: "failed", message: "Please give full details of exit record"});
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}

export async function listEntryExist(req, res) {
    try {
        const hostel_id = req.hostelId
        if (hostel_id != "") {
            const students = await Student.find({ hostel_id }).select("_id student_id name mobile_no parent_mobile_no room_no");
            
            if (!students.length) {
                return res.json({ status: "success", students: [] });
            }
            
            let entryexists = []
            for(let student of students) {
                const entryexist = await EntryExit.findOne({ hostel_id, student_id: student.student_id })
                console.log(entryexist, "==entryexist==");
                const data = {
                    student_id: student.student_id,
                    name: student.name,
                    mobile_no: student.mobile_no,
                    parent_mobile_no: student.parent_mobile_no,
                    room_no: student.room_no,
                    status: entryexist?.status ? entryexist.status : "Not Joined",
                    last_entry_time: entryexist?.entry_time ? entryexist.entry_time : 0,
                    last_exit_time: entryexist?.exit_time ? entryexist.exit_time : 0,
                    next_button: entryexist && entryexist.entry_time < entryexist.exit_time ? "entry" : "exit"
                }
                console.log(data, "==data");
                entryexists.push(data)
            }
            
    
            res.json({ status: "success", students: entryexists });
        } else {
            res.json({ status: "failed", message: "Please give full details of exit record"});
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}