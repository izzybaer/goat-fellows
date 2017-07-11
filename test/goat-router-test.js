'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const clearDB = require('./lib/clearDB.js');
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
      let tempGoat, tempGuardian;
      return mockGuardian.createOne()
        .then(guardian => {
          tempGuardian = guardian;
          return mockGoat.createOne();
        })
        .then(goat => {
          tempGoat = goat;
          console.log(tempGoat, 'tempGoat');
          return superagent.post(`${API_URL}/api/goat`)
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
