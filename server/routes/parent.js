import { Router } from 'express';
const router = Router();
import multer from 'multer'
import { parentJWT } from '../middleware/auth.js';
import { parentAuth, parentLogin } from '../controller/auth.js';
import { listRoom } from '../controller/room.js';

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

// Menu
router.get('/room/list', parentJWT, listRoom)

export default router;