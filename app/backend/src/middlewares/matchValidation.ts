import { NextFunction, Request, Response } from 'express';
import ITeam from '../interfaces/ITeams';
import TeamService from '../service/teams.service';

const message1 = 'It is not possible to create a match with two equal teams';
const message2 = 'There is no team with such id!';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { homeTeam, awayTeam } = req.body;
  const teams: ITeam[] = await TeamService.getAllService();
  const home = teams.some((team: ITeam) => team.id === homeTeam);
  const away = teams.some((team: ITeam) => team.id === awayTeam);

  if (homeTeam === awayTeam) {
    return res.status(422).json({ message: `${message1}` });
  }

  if (!home || !away) {
    return res.status(404).json({ message: `${message2}` });
  }

  next();
};
