import {Router} from 'express';
import TenantController from '../controllers/tenant.controller';

const router = Router();

router.get('/', TenantController.getTenantById)
router.put('/', TenantController.updateTenant)
router.post('/favorite', TenantController.addFavoriteProperty)
router.delete('/favorite', TenantController.removeFavoriteProperty)
router.get("/current-residence", TenantController.getCurrentResidence)


export default router;