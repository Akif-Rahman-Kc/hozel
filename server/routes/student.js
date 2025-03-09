import { Router } from 'express';
const router = Router();
import multer from 'multer'
import { studentJWT } from '../middleware/auth.js';
import { studentAuth, studentLogin, studentRegister } from '../controller/auth.js';
import { createComplaint } from '../controller/complaint.js';

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
router.post('/register', studentRegister)
router.post('/login', studentLogin)
router.post('/auth', studentJWT,studentAuth)

// Complaint
router.post('/complaint/create', studentJWT, createComplaint)

export default router;