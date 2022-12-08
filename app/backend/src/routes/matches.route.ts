import { Router } from 'express';
import matchValidation from '../middlewares/matchValidation';
import controller from '../controller/matches.controller';
import matchToken from '../middlewares/handleToken';

const router = Router();

router.get('/', controller.getMatches);
router.post('/', matchValidation, matchToken, controller.createMatch);
router.patch('/:id', controller.updateMatch);
router.patch('/:id/finish', controller.finishMatch);

export default router;
