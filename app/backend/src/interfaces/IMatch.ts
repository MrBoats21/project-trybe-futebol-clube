import ITeam from './ITeams';

export interface IMatch {
  id?: number;
  homeTeam?: number;
  homeTeamGoals?: number;
  awayTeam?: number;
  awayTeamGoals?: number;
  inProgress?: boolean;
  teamHome?: ITeam;
  teamAway?: ITeam;
}
