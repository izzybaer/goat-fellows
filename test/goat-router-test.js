'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');
const faker = require('faker');

const clearDB = require('./lib/clearDB.js');
const Guardian = require('../model/guardian.js');
const mockUser = require('./lib/mock-user.js');
const mockGoat = require('./lib/mock-goat.js');
const mockGuardian = require('./lib/mock-guardian.js');


const server = require('../lib/server.js');

const API_URL = process.env.API_URL;

describe('testing routes for goat model', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('testing POST /api/goat', () => {
    it.only('should return a new goat and respond with 200', () => {
      let tempUser, tempGoat, tempGuardian;
      return mockUser.createOne()
        .then((userData) => {
          tempUser = userData;
          return new Guardian({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            service: faker.company.bsBuzz(),
            phoneNumber: faker.phone.phoneNumber(),
            userID: userData.user._id.toString(),
          });
        })
        .then(guardian => {
          tempGuardian = guardian;
          return mockGoat.createOne();
        })
        .then(goat => {
          tempGoat = goat;
          console.log('tempUser:\n', tempUser);
          console.log('tempGoat:\n', tempGoat);
          console.log('tempGuardian:\n', tempGuardian);
          return superagent.post(`${API_URL}/api/goat`)
            .set('Authorization', `Bearer ${tempUser.token}`)
            .send(tempGoat);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.city).toEqual(tempGoat.city);
          expect(res.body.state).toEqual(tempGoat.state);
          expect(res.body.address).toEqual(tempGoat.address);
          expect(res.body.photoURI).toEqual(tempGoat.photoURI);
          expect(res.body.story).toEqual(tempGoat.story);
          expect(res.body.userID).toEqual(tempGoat.userID);
          expect(res.body.guardianID).toEqual(tempGoat.guardianID);
        });
    });
  });
});
