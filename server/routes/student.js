import { Router } from 'express';
const router = Router();
import multer from 'multer'
import { studentJWT } from '../middleware/auth.js';
import { studentAuth, studentForgotPassword, studentLogin } from '../controller/auth.js';
import { createComplaint, listComplaint } from '../controller/complaint.js';
import { detailsRoom, listRoom } from '../controller/room.js';
import { listMenu } from '../controller/menu.js';
import { getMonthCheckins, getYearCheckins } from '../controller/checkin.js';
import { studentChangePassword, updateStudentProfile } from '../controller/student.js';

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
router.post('/login', studentLogin)
router.post('/forgot-password', studentForgotPassword)
router.post('/auth', studentJWT,studentAuth)

// Student
router.patch('/student/update-profile', uploads.single('image'), studentJWT, updateStudentProfile)
router.patch('/student/change-password', studentJWT, studentChangePassword)

// Room
router.get('/room/details', studentJWT, detailsRoom)
router.get('/room/list', studentJWT, listRoom)

// Menu
router.get('/menu/list', studentJWT, listMenu)

// Complaint
router.post('/complaint/create', studentJWT, createComplaint)
router.get('/complaint/list', studentJWT, listComplaint)

// Checkin
router.get('/checkin/month-list', studentJWT, getMonthCheckins)
router.get('/checkin/year-list', studentJWT, getYearCheckins)

export default router;