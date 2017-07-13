'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
require('./lib/mock-aws.js');
const superagent = require('superagent');
const expect = require('expect');
const faker = require('faker');

const clearDB = require('./lib/clearDB.js');
const mockGoat = require('./lib/mock-goat.js');
const mockGuardian = require('./lib/mock-guardian.js');


const server = require('../lib/server.js');
const API_URL = process.env.API_URL;

describe('testing routes for goat model', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('testing POST /api/goats', () => {
    it('should return a new goat and respond with 200', () => {
      let tempData;
      let tempAddress = faker.address.streetAddress();
      let tempCity = faker.address.city();
      let tempState = faker.address.stateAbbr();
      let tempStory = faker.lorem.sentence();
      return mockGuardian.createOne()
        .then((userGuardData) => {
          tempData = userGuardData;
          return superagent.post(`${API_URL}/api/goats`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .field('address', tempAddress)
            .field('city', tempCity)
            .field('state', tempState)
            .field('story', tempStory)
            .field('guardianID', tempData.guardian._id.toString())
            .attach('image', `${__dirname}/test-assets/goat.jpg`)
            .then((res) => {
              expect(res.status).toEqual(200);
              expect(res.body.address).toEqual(tempAddress);
              expect(res.body.city).toEqual(tempCity);
              expect(res.body.state).toEqual(tempState);
              expect(res.body.photoURI).toExist();
              expect(res.body.story).toEqual(tempStory);
              expect(res.body.guardianID).toEqual(tempData.guardian._id);
              expect(res.body.userID).toEqual(tempData.user.user._id);
            });
        });
    });
    it('should return a 400 error due to missing field address', () => {
      let tempData;
      let tempCity = faker.address.city();
      let tempState = faker.address.stateAbbr();
      let tempStory = faker.lorem.sentence();
      return mockGuardian.createOne()
        .then((userGuardData) => {
          tempData = userGuardData;
          return superagent.post(`${API_URL}/api/goats`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .field('city', tempCity)
            .field('state', tempState)
            .field('story', tempStory)
            .field('guardianID', tempData.guardian._id.toString())
            .attach('image', `${__dirname}/test-assets/goat.jpg`)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
    it('should return a 401 unauthorized error due to missing Authorization header', () => {
      let tempData;
      let tempAddress = faker.address.streetAddress();
      let tempCity = faker.address.city();
      let tempState = faker.address.stateAbbr();
      let tempStory = faker.lorem.sentence();
      return mockGuardian.createOne()
        .then((userGuardData) => {
          tempData = userGuardData;
          return superagent.post(`${API_URL}/api/goats`)
            .set('potato', `Bearer ${tempData.user.token}`)
            .field('address', tempAddress)
            .field('city', tempCity)
            .field('state', tempState)
            .field('story', tempStory)
            .field('guardianID', tempData.guardian._id.toString())
            .attach('image', `${__dirname}/test-assets/goat.jpg`)
            .catch((res) => {
              expect(res.status).toEqual(401);
            });
        });
    });
    it('should return a 415 due to unexpected field', () => {
      let tempData;
      let tempAddress = faker.address.streetAddress();
      let tempCity = faker.address.city();
      let tempState = faker.address.stateAbbr();
      let tempStory = faker.lorem.sentence();
      return mockGuardian.createOne()
        .then((userGuardData) => {
          tempData = userGuardData;
          return superagent.post(`${API_URL}/api/goats`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .field('address', tempAddress)
            .field('city', tempCity)
            .field('state', tempState)
            .field('story', tempStory)
            .field('guardianID', tempData.guardian._id.toString())
            .attach('potato', `${__dirname}/test-assets/goat.jpg`)
            .catch((res) => {
              expect(res.status).toEqual(415);
            });
        });
    });
    it('should return a 400 due to malformed jwt', () => {
      let tempData;
      let tempAddress = faker.address.streetAddress();
      let tempCity = faker.address.city();
      let tempState = faker.address.stateAbbr();
      let tempStory = faker.lorem.sentence();
      return mockGuardian.createOne()
        .then((userGuardData) => {
          tempData = userGuardData;
          return superagent.post(`${API_URL}/api/goats`)
            .set('Authorization', `Bearer cars`)
            .field('address', tempAddress)
            .field('city', tempCity)
            .field('state', tempState)
            .field('story', tempStory)
            .field('guardianID', tempData.guardian._id.toString())
            .attach('potato', `${__dirname}/test-assets/goat.jpg`)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
  });
  describe('testing GET /api/goats/:id', () => {
    it('should respond with a 200 and a goat message', () => {
      let tempData;
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.get(`${API_URL}/api/goats/${userGuardGoatData.goat._id}`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .then((res) => {
              expect(res.status).toEqual(200);
              expect(res.body.address).toEqual(tempData.goat.address);
              expect(res.body.city).toEqual(tempData.goat.city);
              expect(res.body.state).toEqual(tempData.goat.state);
              expect(res.body.story).toEqual(tempData.goat.story);
              expect(res.body.userID).toEqual(tempData.goat.userID);
              expect(res.body.guardianID).toEqual(tempData.goat.guardianID);
              expect(res.body.photoURI).toExist();
            });
        });
    });
    it('should respond with a 404 due to bad :id in url', () => {
      let tempData;
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.get(`${API_URL}/api/goats/carboy`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .catch((res) => {
              expect(res.status).toEqual(404);
            });
        });
    });
    it('should respond with a 401 due to bad authorization header', () => {
      let tempData;
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.get(`${API_URL}/api/goats/${userGuardGoatData.goat._id}`)
            .set('coolshoes', `Bearer ${tempData.user.token}`)
            .catch((res) => {
              expect(res.status).toEqual(401);
            });
        });
    });
  });
  describe('testing PUT at /api/goats/:id', () => {
    it('should respond with 200 and updated goat body', () => {
      let tempData;
      let tempGoat = {
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        story: faker.lorem.sentence(),
      };
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.put(`${API_URL}/api/goats/${userGuardGoatData.goat._id}`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .send(tempGoat)
            .then((res) => {
              expect(res.status).toEqual(200);
              expect(res.body.address).toEqual(tempGoat.address);
              expect(res.body.city).toEqual(tempGoat.city);
              expect(res.body.state).toEqual(tempGoat.state);
              expect(res.body.story).toEqual(tempGoat.story);
              expect(res.body.userID).toEqual(tempData.goat.userID);
              expect(res.body.guardianID).toEqual(tempData.goat.guardianID);
              expect(res.body.photoURI).toExist();
            });
        });
    });
    it('should respond with 404 due to bad :id', () => {
      let tempData;
      let tempGoat = {
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        story: faker.lorem.sentence(),
      };
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.put(`${API_URL}/api/goats/dogshow`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .send(tempGoat)
            .catch((res) => {
              expect(res.status).toEqual(404);
            });
        });
    });
    it('should respond with 401 due to no authorization header', () => {
      let tempData;
      let tempGoat = {
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        story: faker.lorem.sentence(),
      };
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.put(`${API_URL}/api/goats/${userGuardGoatData.goat._id}`)
            .set('yeaaaaabooooiiii', `Bearer ${tempData.user.token}`)
            .send(tempGoat)
            .catch((res) => {
              expect(res.status).toEqual(401);
            });
        });
    });
  });
  describe('testing DELETE at /api/goats/:id', () => {
    it('should respond with 204 and delete the goat, then a 404 when attempt to GET goat', () => {
      let tempData;
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.delete(`${API_URL}/api/goats/${userGuardGoatData.goat._id}`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .then((res) => {
              expect(res.status).toEqual(204);
            })
            .then((res) => {
              return superagent.get(`${API_URL}/api/goats/${tempData.goat._id}`)
                .set('Authorization', `Bearer ${tempData.user.token}`)
                .catch((err) => {
                  expect(err.status).toEqual(404);
                });
            });
        });
    });
    it('should respond with 404 due to missing id', () => {
      let tempData;
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.delete(`${API_URL}/api/goats/uhohspaghettios`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .catch((res) => {
              expect(res.status).toEqual(404);
            });
        });
    });
    it('should respond with 401 due to bad auth', () => {
      let tempData;
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.delete(`${API_URL}/api/goats/${userGuardGoatData.goat._id}`)
            .set('potatohouse', `Bearer ${tempData.user.token}`)
            .catch((res) => {
              expect(res.status).toEqual(401);
            });
        });
    });
    it('should respond with 400 due to lack of keys', () => {
      let tempData;
      let tempGoat = {};
      return mockGoat.createOne()
        .then((userGuardGoatData) => {
          tempData = userGuardGoatData;
          return superagent.put(`${API_URL}/api/goats/${userGuardGoatData.goat._id}`)
            .set('Authorization', `Bearer ${tempData.user.token}`)
            .send(tempGoat)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
  });
});
