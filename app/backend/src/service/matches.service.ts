import TeamModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';
import TeamService from './teams.service';

const teams = [
  { model: TeamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
  { model: TeamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
];

export default class MatchService {
  static async getAll(): Promise<MatchesModel[]> {
    const matches = MatchesModel.findAll({ include: teams });

    return matches;
  }

  static async getCurrentMatches(inProgress: string): Promise<MatchesModel[] | undefined> {
    const bool = inProgress === 'true';

    if (inProgress) {
      const matches = MatchesModel.findAll({ where: { inProgress: bool }, include: teams });
      return matches;
    }
  }

  static async checkId(homeTeam: string, awayTeam: string): Promise<void> {
    const home = await TeamService.getByIdService(homeTeam);
    const away = await TeamService.getByIdService(awayTeam);

    if (!home || !away) {
      throw new Error();
    }
  }

  static async createMatch(
    homeTeam: string,
    awayTeam: string,
    homeTeamGoals: string,
    awayTeamGoals: string,
  ): Promise<null> {
    await MatchService.checkId(homeTeam, awayTeam);

    const newMatch = await MatchesModel.create({
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true,
    });

    const { id } = newMatch.dataValues;

    return id;
  }

  static async finishMatch(id: number) {
    await MatchesModel.update({ inProgress: false }, { where: { id } });
    return { message: 'finished match' };
  }
}
