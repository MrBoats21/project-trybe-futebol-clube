import { Model, INTEGER, BOOLEAN } from 'sequelize';
import db from '.';
import TeamsModel from './TeamsModel';

class Match extends Model {
  declare id: number;
  declare teamName: string;
}

Match.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    homeTeam: INTEGER,
    homeTeamGoals: INTEGER,
    awayTeam: INTEGER,
    awayTeamGoals: INTEGER,
    inProgress: BOOLEAN,
  },
  {
    underscored: true,
    sequelize: db,
    tableName: 'matches',
    timestamps: false,
  },
);

TeamsModel.hasMany(Match, { foreignKey: 'homeTeam', as: 'teamHome' });
TeamsModel.hasMany(Match, { foreignKey: 'awayTeam', as: 'teamAway' });

Match.belongsTo(TeamsModel, { foreignKey: 'homeTeam', as: 'teamHome' });
Match.belongsTo(TeamsModel, { foreignKey: 'awayTeam', as: 'teamAway' });

export default Match;
