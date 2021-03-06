'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');
const faker = require('faker');
const clearDB = require('./lib/clearDB.js');
const mockUser = require('./lib/mock-user.js');
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
  describe('testing GET at /api/login', () => {
    it('Should return a user and 200.', () => {
      let tempUser;
      return mockUser.createOne()
        .then(userData => {
          tempUser = userData.user;
          let encoded = new Buffer(`${tempUser.username}:${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/login`)
            .set('Authorization', `Basic ${encoded}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
        });
    });

    it('Should return 401 due to bad password.', () => {
      let tempUser;
      return mockUser.createOne()
        .then(userData => {
          tempUser = userData.user;
          let encoded = new Buffer(`${tempUser.username}:wut`).toString('base64');
          return superagent.get(`${API_URL}/api/login`)
            .set('Authorization', `Basic ${encoded}`);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    it('Should return 401 due to bad username.', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`lol: ${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/login`)
            .set('Authorization', `Basic ${encoded}`);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    it('Should return 401 due to bad auth header.', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`${userData.username}: ${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/login`)
            .set('goat', `Basic ${encoded}`);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    it('Should return 401 due to bad encoded.', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.get(`${API_URL}/api/login`)
            .set('Authorization', `Basic anotherGoat`);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    it('Should return 401 unauthorized due to no encoded value', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.get(`${API_URL}/api/login`)
            .set('Authorization', `Basic `);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    it('Should return 401 due to bad basic.', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`${userData.username}: ${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/login`)
            .set('goat', `L33t ${encoded}`);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });

  describe('testing PUT on /api/users/:id', () => {
    it('should respond with a 200', () => {
      let tempUser;
      let fakeUser = {
        email: 'potatoSDFAS@email.com',
        username: 'carhatadgasd',
        password: 'dynomite',
      };
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.put(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`Authorization`, `Bearer ${tempUser.token}`)
            .send(fakeUser);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.username).toEqual(fakeUser.username);
          expect(res.body.password).toExist();
          expect(res.body.password).toNotEqual(tempUser.password);
          expect(res.body.email).toEqual(fakeUser.email);
          expect(res.body.userID).toEqual(tempUser.user.userID);
        });
    });
    it('should respond with a 400 due to empty body', () => {
      let tempUser;
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.put(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`Authorization`, `Bearer ${tempUser.token}`)
            .send({});
        })
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
    it('should respond with a 401 due to bad token', () => {
      let tempUser;
      let fakeUser = {
        email: 'potatoSDFAS@email.com',
        username: 'carhatadgasd',
        password: 'dynomite',
      };
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.put(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`Authorization`, `Bearer ${tempUser.token}d`)
            .send(fakeUser);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
    it('should respond with a 401 due to no auth header', () => {
      let tempUser;
      let fakeUser = {
        email: 'potatoSDFAS@email.com',
        username: 'carhatadgasd',
        password: 'dynomite',
      };
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.put(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`FakeFake`, `Bearer ${tempUser.token}`)
            .send(fakeUser);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
    it('should respond with a 401 due to no bearer', () => {
      let tempUser;
      let fakeUser = {
        email: 'potatoSDFAS@email.com',
        username: 'carhatadgasd',
        password: 'dynomite',
      };
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.put(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`Authorization`, `Bearer `)
            .send(fakeUser);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });

  describe('testing DELETE on /api/users/:id', () => {
    it('should respond with a PUT 204 then a get 401 unauthorized due to invalid token', () => {
      let tempUser;
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.delete(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`Authorization`, `Bearer ${tempUser.token}`);
        })
        .then((res) => {
          expect(res.status).toEqual(204);
        })
        .then((res) => {
          return superagent.delete(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`Authorization`, `Bearer ${tempUser.token}`);
        })
        .catch((res) => {
          expect(res.status).toEqual(401);
        });
    });
    it('should respond with a PUT 404 due to bad id in url', () => {
      let tempUser;
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.delete(`${API_URL}/api/users/adfasd`)
            .set(`Authorization`, `Bearer ${tempUser.token}`);
        })
        .catch((res) => {
          expect(res.status).toEqual(404);
        });
    });
    it('should respond with a PUT 401 due to no auth header', () => {
      let tempUser;
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.delete(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`yippie`, `Bearer ${tempUser.token}`);
        })
        .catch((res) => {
          expect(res.status).toEqual(401);
        });
    });
    it('should respond with a PUT 401 due to bad token', () => {
      let tempUser;
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.delete(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`Authorization`, `Bearer ${tempUser.token}d`);
        })
        .catch((res) => {
          expect(res.status).toEqual(401);
        });
    });
    it('should respond with a PUT 401 due no token', () => {
      let tempUser;
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return superagent.delete(`${API_URL}/api/users/${tempUser.user._id}`)
            .set(`Authorization`, `Bearer `);
        })
        .catch((res) => {
          expect(res.status).toEqual(401);
        });
    });
  });

  describe('testing catch all 404s', () => {
    it('should return 404 /api/*', () => {
      return superagent.get(`${API_URL}/api/blah`)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    it('should return 404 /*', () => {
      return superagent.get(`${API_URL}/bleh`)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    it('should return 409 for dupe key', () => {
      let tempEmail = faker.internet.email();

      return superagent.post(`${API_URL}/api/signup`)
        .send({
          email: tempEmail,
          username: faker.internet.userName(),
          password: faker.internet.password(),
        })
        .then((res) => {
          return superagent.post(`${API_URL}/api/signup`)
            .send({
              email: tempEmail,
              username: faker.internet.userName(),
              password: faker.internet.password(),
            })
            .catch((err) => {
              expect(err.status).toEqual(409);
            });
        });
    });
  });
});
