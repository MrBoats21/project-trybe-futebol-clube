import { Router } from 'express';
import token from '../middlewares/handleToken';
import controller from '../controller/login.controller';

const router = Router();

router.post('/', controller.login);
router.get('/validate', token, controller.getByRole);

export default router;
