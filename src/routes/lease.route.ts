import {Router} from 'express'
import authMiddleware from '../middlewares/auth.middleware';
import { role } from '../consts/role';
import LeaseController from '../controllers/lease.controller';

const router = Router();

router.get('/', authMiddleware([role.manager, role.tenant]), LeaseController.getAll)
router.get('/:id/payments', authMiddleware([role.manager, role.tenant]), LeaseController.getLeasePayments)

export default router;