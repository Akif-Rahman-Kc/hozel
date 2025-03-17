import Checkin from "../model/checkin-schema.js";
import Student from "../model/student-schema.js";
import Room from "../model/room-schema.js";

//////////////////////////////////////////////////////  CHECKIN  //////////////////////////////////////////////////////

export async function createCheckin(req, res) {
    try {
        const { student_id, student_name, mobile_no, checkin_time } = req.body;
        if (student_id != "" && student_name != "" && mobile_no != "" && checkin_time != "") {
            const today = new Date().setHours(0, 0, 0, 0);
            console.log(today, "==today==");

            // check if already checkin today
            const existing_checkin = await Checkin.findOne({ student_id, date: today });
            if (existing_checkin) {
                res.json({ failed: "success", message: "Student has already checked in today." });
            }
            
            await Checkin.create({student_id, student_name, mobile_no, date: today, checkin_time});
            res.json({ status: "success" });
        } else {
            res.json({ status: "failed", message: "Please give full details of checkin"});
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}

export async function listCheckin(req, res) {
    try {
        const hostel_id = req.hostelId ? req.hostelId : req.query.hostel_id
        const students = await Student.find({ hostel_id: hostel_id }).sort({ created_at: -1 })
        const today = Date.now()
        const first_day = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(); // first day of the month

        let student_data = [];
        for (const student of students) {
            const student_rent = await Room.findOne({room_no: student.room_no})
            
            const checkin_count = await Checkin.countDocuments({
                student_id: student.student_id,
                date: { $gte: first_day, $lte: today }, // filter checkins this month
            });
            

            const now = new Date();
            const days_in_month = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(); // total days in month
            const per_day_rent = student_rent.price / days_in_month; // calculate per-day rent
            const payable_amount = checkin_count * per_day_rent; // total rent based on attendance

            const current_day = new Date().setHours(0, 0, 0, 0);
            const checkin = await Checkin.findOne({ student_id: student.student_id, date: current_day });

            student_data.push({
                student_id: student.student_id,
                name: student.name,
                mobile_no: student.mobile_no,
                parent_mobile_no: student.parent_mobile_no,
                room_no: student.room_no,
                checkin_days: checkin_count,
                payable_rent: payable_amount.toFixed(2),
                checkin_time: checkin?.checkin_time
            });
        }
        
        res.json({ status: "success", student_data })
    } catch (error) {
        res.json({ status: "failed", message: "Network error" })
    }
}

export async function getMonthCheckins(req, res) {
    try {
        const student = await Student.findById(req.query._id)
        if (student) {
            const today = Date.now()
            const first_day_of_month = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(); // first day of the month

            const checkins = await Checkin.find({
                student_id: student.student_id,
                date: { $gte: first_day_of_month, $lte: today }, // filter checkins this month
            });
            res.json({ status: "success", checkins });
        } else {
            res.json({ status: "failed", message: "Student not exist, please login again" });
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}

export async function getYearCheckins(req, res) {
    try {
        const student = await Student.findById(req.query._id)
        if (student) {
            const now = new Date();
            const current_month = now.getMonth(); // Current month (0-based index)
            const current_year = now.getFullYear();

            let monthly_data = [];

            for (let month = 0; month <= current_month; month++) {
                const first_day = new Date(current_year, month, 1).getTime(); // first day of the month
                const last_day = new Date(current_year, month + 1, 0).getTime(); // last day of the month

                // get room rent data
                const student_rent = await Room.findOne({ room_no: student.room_no });

                // count check-ins within the month
                const checkin_count = await Checkin.countDocuments({
                    student_id: student.student_id,
                    date: { $gte: first_day, $lte: last_day }
                });

                // calculate per-day rent
                const days_in_month = new Date(current_year, month + 1, 0).getDate();
                const per_day_rent = student_rent.price / days_in_month;
                const payable_amount = checkin_count * per_day_rent;

                monthly_data.push({
                    month: new Date(current_year, month).toLocaleString('default', { month: 'long' }),
                    checkin_days: checkin_count,
                    payable_rent: payable_amount.toFixed(2)
                });
            }
            res.json({ status: "success", monthly_data });
        } else {
            res.json({ status: "failed", message: "Student not exist, please login again" });
        }
    } catch (error) {
        res.json({ status: "failed", message: "Network error" });
    }
}