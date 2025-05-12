import {Router} from 'express';
import multer from 'multer';
import PropertyController from '../controllers/property.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { role } from '../consts/role';

const router = Router();

const upload = multer({dest: 'uploads/'});

router.post('/', upload.array('images'),authMiddleware([role.manager]) ,PropertyController.create)
router.get('/', PropertyController.findAll);
router.get('/:id', PropertyController.findById);

export default router;