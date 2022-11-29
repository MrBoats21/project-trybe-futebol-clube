import * as express from 'express';
import TeamController from '../controller/teams.controller';

const router = express.Router();

router.get('/', TeamController.getAll);
router.get('/:id', TeamController.getById);

export default router;
