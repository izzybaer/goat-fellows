'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');
const faker = require('faker');

const clearDB = require('./lib/clearDB.js');
// const userRouter = require('../route/user-router.js');
// const mockUser = require('./lib/mock-user.js');
const server = require('../lib/server.js');
const API_URL = process.env.API_URL;

describe('testing user auth routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);
  describe('testing POST at /api/signup', () => {
    it('should respond with a 200 status and a token', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          email: faker.internet.email(),
          username: faker.internet.userName(),
          password: faker.internet.password(),
        })
        .then((res) => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
        });
    });
    it('should respond with a 400 status due to missing email', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          username: faker.internet.userName(),
          password: faker.internet.password(),
        })
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
    it('should respond with a 400 status due to missing username', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
    it('should respond with a 400 status due to missing password', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
        })
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
    it('should respond with a 400 status due to no body', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({})
        .catch((res) => {
          expect(res.status).toEqual(400);
        });
    });
  });
});
