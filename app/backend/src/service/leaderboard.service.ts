import { Op } from 'sequelize';
import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/MatchesModel';
import { IMatch } from '../interfaces/IMatch';

export default class service {
  static async getWins(matches: IMatch[], teamId: number) {
    let wins = 0;
    matches.forEach(({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }) => {
      if (teamId === homeTeam && Number(homeTeamGoals) > Number(awayTeamGoals)) {
        wins += 1;
      } if (teamId === awayTeam && Number(awayTeamGoals) > Number(homeTeamGoals)) {
        wins += 1;
      } if (Number(homeTeamGoals) === Number(awayTeamGoals)) { wins += 0; }
    });
    return wins;
  }

  static async getDraws(matches: IMatch[]) {
    let draws = 0;
    matches.forEach(({ homeTeamGoals, awayTeamGoals }) => {
      if (Number(homeTeamGoals) === Number(awayTeamGoals)) { draws += 1; }
    });
    return draws;
  }

  static async getLosses(matches: IMatch[], teamId: number) {
    let losses = 0;
    matches.forEach(({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }) => {
      if (teamId === homeTeam && Number(homeTeamGoals) < Number(awayTeamGoals)) {
        losses += 1;
      } if (teamId === awayTeam && Number(awayTeamGoals) < Number(homeTeamGoals)) {
        losses += 1;
      } if (Number(homeTeamGoals) === Number(awayTeamGoals)) { losses += 0; }
    });
    return losses;
  }

  static async getGoalsfavor(matches: IMatch[], teamId: number) {
    let favor = 0;
    matches.forEach(({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }) => {
      if (teamId === homeTeam) { favor += Number(homeTeamGoals); }
      if (teamId === awayTeam) { favor += Number(awayTeamGoals); }
    });
    return favor;
  }

  static async getGoals(matches: IMatch[], teamId: number) {
    let goals = 0;
    matches.forEach(({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals }) => {
      if (teamId === homeTeam) { goals += Number(awayTeamGoals); }
      if (teamId === awayTeam) { goals += Number(homeTeamGoals); }
    });
    return goals;
  }

  static async getPoints(matches: IMatch[], teamId: number) {
    const wins = await service.getWins(matches, teamId);
    const draws = await service.getDraws(matches);
    return wins * 3 + draws;
  }

  static async getEfficency(matches: IMatch[], teamId: number, length: number) {
    const totalPoints = await service.getPoints(matches, teamId);
    const totalGames = length * 3;
    return ((totalPoints / totalGames) * 100).toFixed(2);
  }

  static async getName(id: number) {
    const team = await Teams.findOne({ where: { id } });
    return team?.dataValues.teamName;
  }

  static async getInfo(matches: IMatch[], teamId: number) {
    return {
      name: await service.getName(teamId),
      totalPoints: await service.getPoints(matches, teamId),
      totalGames: matches.length,
      totalVictories: await service.getWins(matches, teamId),
      totalDraws: await service.getDraws(matches),
      totalLosses: await service.getLosses(matches, teamId),
      goalsFavor: await service.getGoalsfavor(matches, teamId),
      goalsOwn: await service.getGoals(matches, teamId),
      goalsBalance: await service.getGoalsfavor(matches, teamId)
      - await service.getGoals(matches, teamId),
      efficiency: await service.getEfficency(matches, teamId, matches.length),
    };
  }

  static async getHomeTeams() {
    const array = [];
    const teams = await Teams.findAll();
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < teams.length; i += 1) {
      const teamId = teams[i].id;
      const matches = await Matches.findAll({
        where: { [Op.or]: [{ homeTeam: teamId }], inProgress: false },
      });
      array.push(await this.getInfo(matches, teamId));
    }
    return array.sort((teamA, teamB) => (
      teamB.totalPoints - teamA.totalPoints
      || teamB.totalVictories - teamA.totalVictories
      || teamB.goalsBalance - teamA.goalsBalance
      || teamB.goalsFavor - teamA.goalsFavor
      || teamA.goalsOwn - teamB.goalsOwn));
  }
}
