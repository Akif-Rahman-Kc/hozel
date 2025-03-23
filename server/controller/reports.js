import Student from "../model/student-schema.js";
import Room from "../model/room-schema.js";
import Complaint from "../model/complaint-schema.js";

//////////////////////////////////////////////////////  REPORTS  //////////////////////////////////////////////////////

export async function studentsReport(req, res) {
    try {
        const { year } = req.query;
        const start_of_year = new Date(year, 0, 1).getTime();
        const end_of_year = new Date(year, 11, 31, 23, 59, 59).getTime();

        const students = await Student.aggregate([
            {
                $match: {
                    hostel_id: req.hostelId,
                    created_at: { $gte: start_of_year, $lte: end_of_year }
                }
            },
            {
                $group: {
                    _id: { $month: { $toDate: "$created_at" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format data for the frontend
        const report_data = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('en', { month: 'short' }),
            students: students.find((s) => s._id === i + 1)?.count || 0
        }));

        const student_list = await Student.find({
            hostel_id: req.hostelId,
            created_at: { $gte: start_of_year, $lte: end_of_year }
        }).select("student_id name mobile_no parent_mobile_no address age gender year department college hostel_mobile_no room_no");

        res.json({ status: "success", report_data, student_list });
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}

export async function complaintsReport(req, res) {
    try {
        const { year } = req.query;
        const start_of_year = new Date(year, 0, 1).getTime();
        const end_of_year = new Date(year, 11, 31, 23, 59, 59).getTime();

        const complaints = await Complaint.aggregate([
            {
                $match: {
                    hostel_id: req.hostelId,
                    created_at: { $gte: start_of_year, $lte: end_of_year }
                }
            },
            {
                $group: {
                    _id: { $month: { $toDate: "$created_at" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format data for the frontend
        const report_data = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('en', { month: 'short' }),
            complaints: complaints.find((s) => s._id === i + 1)?.count || 0
        }));

        const complaint_list = await Complaint.find({
            hostel_id: req.hostelId,
            created_at: { $gte: start_of_year, $lte: end_of_year }
        }).select("student_name room_no status description created_at");

        res.json({ status: "success", report_data, complaint_list });
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}

export async function roomsReport(req, res) {
    try {
        const { year } = req.query;
        const start_of_year = new Date(year, 0, 1).getTime();
        const end_of_year = new Date(year, 11, 31, 23, 59, 59).getTime();

        const rooms = await Room.aggregate([
            {
                $match: {
                    hostel_id: req.hostelId,
                    created_at: { $gte: start_of_year, $lte: end_of_year }
                }
            },
            {
                $group: {
                    _id: { $month: { $toDate: "$created_at" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Format data for the frontend
        const report_data = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('en', { month: 'short' }),
            rooms: rooms.find((s) => s._id === i + 1)?.count || 0
        }));

        const room_list = await Room.find({
            hostel_id: req.hostelId,
            created_at: { $gte: start_of_year, $lte: end_of_year }
        }).select("room_type room_no capacity facilities price availability status occupants");

        res.json({ status: "success", report_data, room_list });
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}