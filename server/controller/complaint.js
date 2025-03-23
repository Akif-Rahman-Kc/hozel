import Complaint from "../model/complaint-schema.js";

//////////////////////////////////////////////////////  COMPLAINT  //////////////////////////////////////////////////////

export async function createComplaint(req, res) {
    try {
        const { hostel_id, student_name, room_no, description } = req.body;
        if (hostel_id != "" && student_name != "" && room_no != "" && description != "") {
            await Complaint.create({hostel_id, student_name, room_no, description});
            res.json({ status: "success" });
        } else {
            res.json({ status: "failed", message: "Please enter full details of complaint"});
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}

export async function detailsComplaint(req, res) {
    try {
        const complaint = await Complaint.findById(req.query._id)
        res.json({ status: "success", complaint })
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function listComplaint(req, res) {
    try {
        const hostel_id = req.hostelId ? req.hostelId : req.query.hostel_id
        const complaints = await Complaint.find({ hostel_id: hostel_id }).sort({ created_at: -1 })
        res.json({ status: "success", complaints })
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
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
        res.json({ status: "failed", message: "Network error" })
    }
}