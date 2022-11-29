import { Request, Response } from 'express';
import TeamService from '../service/teams.service';

export default class TeamController {
  static async getAll(req: Request, res: Response) {
    const teams = await TeamService.getAllService();
    return res.status(200).json(teams);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await TeamService.getByIdService(id);
    return res.status(200).json(team);
  }
}
