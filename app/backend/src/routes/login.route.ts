import * as express from 'express';
import handleJwt from '../middlewares/handleJwt';
import LoginController from '../controller/login.controller';

const router = express.Router();

router.post('/', LoginController.login);
router.get('/validate', handleJwt, LoginController.getByRole);

export default router;
