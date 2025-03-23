import { Router } from 'express';
const router = Router();
import multer from 'multer'
import { hostelJWT } from '../middleware/auth.js';
import { hostelAuth, hostelForgotPassword, hostelLogin, hostelRegister } from '../controller/auth.js';
import { createStudent, deleteStudent, listStudent, updateStudent, updateStudentStatus } from '../controller/student.js';
import { createRoom, deleteRoom, detailsRoom, listRoom, updateRoom, updateRoomStatus } from '../controller/room.js';
import { listParent } from '../controller/parent.js';
import { listComplaint, updateComplaintStatus } from '../controller/complaint.js';
import { createCheckin, listCheckin } from '../controller/checkin.js';
import { listMenu, updateMenu } from '../controller/menu.js';
import { complaintsReport, roomsReport, studentsReport } from '../controller/reports.js';
import { listEntryExist, markEntry, markExit } from '../controller/entryexit.js';

///////////////// Multer /////////////////
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('invalid image file!', false);
    }
};

const uploads = multer({ storage, fileFilter });
//////////////////////////////////////////

// Authentication
router.post('/register', hostelRegister)
router.post('/login', hostelLogin)
router.post('/forgot-password', hostelForgotPassword)
router.post('/auth', hostelJWT, hostelAuth)

// Student
router.post('/student/create', hostelJWT, createStudent)
router.get('/student/list', hostelJWT, listStudent)
router.patch('/student/update', hostelJWT, updateStudent)
router.patch('/student/update-status', hostelJWT, updateStudentStatus)
router.delete('/student/delete', hostelJWT, deleteStudent)

// Parent
router.get('/parent/list', hostelJWT, listParent)

// Room
router.post('/room/create', uploads.single('image'), hostelJWT, createRoom)
router.get('/room/details', hostelJWT, detailsRoom)
router.get('/room/list', hostelJWT, listRoom)
router.patch('/room/update', uploads.single('image'), hostelJWT, updateRoom)
router.patch('/room/update-status', hostelJWT, updateRoomStatus)
router.delete('/room/delete', hostelJWT, deleteRoom)

// Complaint
router.get('/complaint/list', hostelJWT, listComplaint)
router.patch('/complaint/update-status', hostelJWT, updateComplaintStatus)

// Menu
// router.post('/menu/create', hostelJWT, createMenu)
router.get('/menu/list', hostelJWT, listMenu)
router.patch('/menu/update', hostelJWT, updateMenu)

// Checkin
router.post('/checkin/create', hostelJWT, createCheckin)
router.get('/checkin/list', hostelJWT, listCheckin)

// Entry Exit
router.post('/entryexit/mark-exit', hostelJWT, markExit)
router.post('/entryexit/mark-entry', hostelJWT, markEntry)
router.get('/entryexit/list', hostelJWT, listEntryExist)

// Reports
router.get('/report/student', hostelJWT, studentsReport)
router.get('/report/complaint', hostelJWT, complaintsReport)
router.get('/report/room', hostelJWT, roomsReport)

export default router;