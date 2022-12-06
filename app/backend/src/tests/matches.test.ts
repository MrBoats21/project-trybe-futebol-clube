import * as sinon from "sinon";
import * as chai from "chai";
import * as jwt from "jsonwebtoken";
// @ts-ignore
import chaiHttp = require("chai-http");
import App from "../app";

const { app } = new App();
const { expect } = chai;

import { Response } from "superagent";
import Match from "../database/models/MatchesModel";
import { mockTeam, sucessMatchMock } from "./mocks/matches.mock";
import Team from "../database/models/TeamsModel";

chai.use(chaiHttp);

describe("Matches tests", () => {
  let res: Response;

  beforeEach(() => {
    sinon.restore();
  });

  it("Tests if user can create a match", async () => {
    sinon.stub(Match, "update").resolves([0]);
    res = await chai.request(app).patch("/matches/1/finish");

    expect(res.status).to.be.equal(200);
    expect(res.body).to.deep.equal({ message: 'Finished' });
  });

  it("Tests if user can create a match", async () => {
    sinon.stub(jwt, 'verify').resolves({ id: 12 });
    sinon.stub(Team, 'findByPk').resolves(mockTeam as any);
    sinon.stub(Match, "create").resolves(12 as any);

    res = await chai.request(app).post("/matches").send({
        homeTeam: 1, awayTeam: 2, homeTeamGoals: 0, awayTeamGoals: 0,
      }).set("Authorization", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')

    expect(res.status).to.be.equal(201);

    expect(res.body).to.deep.equal(sucessMatchMock);
  });

  it("tests if its not possible to create a match with two equal teams", async () => {
    sinon.stub(jwt, "verify").resolves({ id: 1 });
    res = await chai.request(app).post("/matches").send({
homeTeam: 1, awayTeam: 1, homeTeamGoals: 2, awayTeamGoals: 2,
      }).set("Authorization", "token");

    expect(res.status).to.be.equal(422);
    expect(res.body).to.deep.equal({ message: "It is not possible to create a match with two equal teams" });
  });

  it("Tests if user cannot create a match with a non existent team", async () => {
    const test = { homeTeam: 666, awayTeam: 5, homeTeamGoals: 0, awayTeamGoals: 0 }
    sinon.stub(jwt, "verify").resolves({ id: 12 });
    sinon.stub(Team, 'findByPk').resolves(null);
    res = await chai.request(app).post("/matches").send({test}).set("Authorization", "token");

    expect(res.status).to.be.equal(404);
    expect(res.body).to.deep.equal({ message: "There is no team with such id!" });
  });
});
