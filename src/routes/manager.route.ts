import{Router} from 'express';
import ManagerController from '../controllers/manager.controller';

const router = Router();

router.get('/', ManagerController.getManager)
router.put('/', ManagerController.update);
router.get('/properties', ManagerController.getManagerProperties);

export default router;