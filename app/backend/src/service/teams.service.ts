import ITeams from '../interfaces/ITeams';
import TeamsModel from '../database/models/TeamsModel';

export default class TeamService {
  static async getAllService(): Promise<ITeams[]> {
    const teams = await TeamsModel.findAll();
    return teams;
  }

  static async getByIdService(id: string): Promise<TeamsModel> {
    const result = await TeamsModel.findByPk(id);
    if (result) {
      return result;
    }
    throw new Error();
  }
}
