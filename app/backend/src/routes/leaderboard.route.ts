import { Router } from 'express';
import controller from '../controller/leaderboard.controller';

const router = Router();

router.get('/home', controller.getHomeTeams);

export default router;
