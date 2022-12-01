import { Request, Response } from 'express';
import MatchService from '../service/matches.service';

export default class MatchController {
  static async getMatches(req: Request, res: Response) {
    const { inProgress } = req.query;

    const query = !inProgress ? await MatchService.getAll()
      : await MatchService.getCurrentMatches(inProgress as string);
    return res.status(200).json(query);
  }

  static async createMatch(req: Request, res: Response) {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = req.body;

    const id = await MatchService.createMatch(
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
    );

    return res.status(201).json({
      id,
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });
  }

  static async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const message = await MatchService.finishMatch(Number(id));
    res.status(200).json(message);
  }
}
