import { Router } from 'express';
const router = Router();
import multer from 'multer'
import { parentJWT } from '../middleware/auth.js';
import { parentAuth, parentLogin } from '../controller/auth.js';
import { detailsRoom, listRoom } from '../controller/room.js';
import { listMenu } from '../controller/menu.js';
import { listComplaint } from '../controller/complaint.js';
import { getMonthCheckins, getYearCheckins } from '../controller/checkin.js';

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
router.post('/login', parentLogin)
router.post('/auth', parentJWT, parentAuth)

// Room
router.get('/room/details', parentJWT, detailsRoom)
router.get('/room/list', parentJWT, listRoom)

// Menu
router.get('/menu/list', parentJWT, listMenu)

// Complaint
router.get('/complaint/list', parentJWT, listComplaint)

// Checkin
router.get('/checkin/month-list', parentJWT, getMonthCheckins)
router.get('/checkin/year-list', parentJWT, getYearCheckins)

export default router;