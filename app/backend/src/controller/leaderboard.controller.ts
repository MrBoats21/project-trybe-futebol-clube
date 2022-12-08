import { Request, Response } from 'express';
import Service from '../service/leaderboard.service';

export default class LeaderboardController {
  static async getHomeTeams(req: Request, res: Response) {
    const data = await Service.getHomeTeams();
    return res.status(200).json(data);
  }
}
