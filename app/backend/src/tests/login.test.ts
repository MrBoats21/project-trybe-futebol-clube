import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// @ts-ignore
import chaiHttp = require('chai-http');
import App from '../app';
import User from '../database/models/UserModel';
import { userMock } from './mocks/users.mock';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;


describe('POST/LOGIN Tests', () => {
    beforeEach(() => {
        sinon.restore();
        })

    it('Tests if login fails without email', async () => {
        const res = await chai.request(app).post('/login').send({
        "email": '',
        "password": "secret"
        })
        expect(res.status).to.be.equal(400);
        expect(res.body).to.deep.equal({ message: 'All fields must be filled' });
    });

    it('Tests if login fails without password', async () => {
        const res = await chai.request(app).post('/login').send({
        "email": 'admin@admin.com',
        "password": ''
        })

        expect(res.status).to.be.equal(400);
        expect(res.body).to.deep.equal({ message: 'All fields must be filled' });
    });

    it('Tests INVALID email', async () => {
        const res = await chai.request(app).post('/login').send({
        "email": 'admin',
        "password": 'secret_admin'
        })

        expect(res.status).to.be.equal(401);
        expect(res.body).to.deep.equal({ message: 'Incorrect email or password' });
    });

    it('Tests VALID password', async () => {
        sinon.stub(User, 'findOne').resolves(userMock as User);
        sinon.stub(bcrypt, 'compareSync').returns(true);

        const res = await chai.request(app).post('/login').send({
            "email": "admin@admin.com",
            "password": "secret_admin"
        })

        expect(res.status).to.be.equal(200);
    });

    it('Tests INVALID password', async () => {
        sinon.stub(User, 'findOne').resolves(userMock as User);
        sinon.stub(bcrypt, 'compareSync').returns(false);

        const res = await chai.request(app).post('/login').send({
            "email": "admin@admin.com",
            "password": "secret"
        });

        expect(res.status).to.be.equal(401);
    });
})

describe('GET/LOGIN tests', () => {

    it('Tests if it fails using an invalid token', async () => {
        const header = { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }
        const res = await chai.request(app).get('/login/validate').set(header)

        expect(res.status).to.be.equal(401);
        expect(res.body).to.deep.equal({ message: 'Token must be a valid token' });
    })

    it('Tests admin user', async () => {
        const header = { Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }
        const res = await chai.request(app).get('/login/validate').set(header)

        sinon.stub(jsonwebtoken, 'verify').resolves({ id: 1 });
        sinon.stub(User, 'findOne').resolves(userMock as User);

        expect(res.status).to.be.equal(200);
        expect(res.body).to.deep.equal({ role: 'Admin' });
    })

})
