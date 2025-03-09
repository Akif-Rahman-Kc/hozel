import Complaint from "../model/complaint-schema.js";

//////////////////////////////////////////////////////  COMPLAINT  //////////////////////////////////////////////////////

export async function createComplaint(req, res) {
    try {
        const { student_name, room_no, description } = req.body;
        if (student_name != "" && room_no != "" && description != "") {
            await Complaint.create({student_name, room_no, description});
            res.json({ status: "success" });
        } else {
            res.json({ status: "failed", message: "Please enter full details of complaint"});
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" });
    }
}

export async function detailsComplaint(req, res) {
    try {
        const complaint = await Complaint.findById(req.query._id)
        res.json({ status: "success", complaint })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function listComplaint(req, res) {
    try {
        const complaints = await Complaint.find().sort({ created_at: -1 })
        res.json({ status: "success", complaints })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function updateComplaintStatus(req, res) {
    try {
        const complaint = await Complaint.findById(req.body._id)
        if (complaint) {
            await Complaint.updateOne({ _id: req.body._id }, {
                $set: {
                    status: req.body.status ? req.body.status : complaint.status
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This complaint not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}