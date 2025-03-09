import { Router } from 'express';
const router = Router();
import multer from 'multer'
import { hostelJWT } from '../middleware/auth.js';
import { hostelAuth, hostelLogin } from '../controller/auth.js';
import { deleteStudent, listStudent, updateStudent, updateStudentStatus } from '../controller/student.js';
import { createRoom, deleteRoom, detailsRoom, listRoom, updateRoom, updateRoomStatus } from '../controller/room.js';
import { listParent } from '../controller/parent.js';
import { listComplaint, updateComplaintStatus } from '../controller/complaint.js';
import { createCheckin, listCheckin } from '../controller/checkin.js';

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
router.post('/login', hostelLogin)
router.post('/auth', hostelJWT, hostelAuth)

// Student
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

// Checkin
router.post('/checkin/create', hostelJWT, createCheckin)
router.get('/checkin/list', hostelJWT, listCheckin)

export default router;