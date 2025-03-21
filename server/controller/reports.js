import Student from "../model/student-schema.js";
import Room from "../model/room-schema.js";
import Complaint from "../model/complaint-schema.js";

//////////////////////////////////////////////////////  STUDENTS  //////////////////////////////////////////////////////

export async function studentReports(req, res) {
    try {
        const { year } = req.query;
        const start_of_year = new Date(year, 0, 1).getTime();
        const end_of_year = new Date(year, 11, 31, 23, 59, 59).getTime();

        const students = await Student.aggregate([
            {
                $match: {
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
        console.log(students, "aa");
        

        // Format data for the frontend
        const reportData = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('en', { month: 'short' }),
            students: students.find((s) => s._id === i + 1)?.count || 0
        }));

        console.log(reportData, "reportData");

        res.json({ status: "success", reportData });
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}