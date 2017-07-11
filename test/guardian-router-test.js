'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');
const faker = require('faker');

const clearDB = require('./lib/clearDB.js');
// const mockGuardian = require('./lib/mock-guardian.js');

const mockUser = require('./lib/mock-user.js');
const server = require('../lib/server.js');
const API_URL = process.env.API_URL;

describe('testing guardian-routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);
  describe('testing POST at /api/guardians', () => {
    it('should return a POST 200 and returns the created guardian', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            service: faker.company.bsBuzz(),
            phoneNumber: faker.phone.phoneNumber(),
          };
          return superagent.post(`${API_URL}/api/guardians`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(tempGuardian)
            .then((res) => {
              expect(res.status).toEqual(200);
              expect(res.body.firstName).toEqual(tempGuardian.firstName);
              expect(res.body.lastName).toEqual(tempGuardian.lastName);
              expect(res.body.email).toEqual(tempUser.user.email);
              expect(res.body.city).toEqual(tempGuardian.city);
              expect(res.body.state).toEqual(tempGuardian.state);
              expect(res.body.service).toEqual(tempGuardian.service);
              expect(res.body.phoneNumber).toEqual(tempGuardian.phoneNumber);
              expect(res.body.userID).toEqual(tempUser.user._id);
            });
        });
    });
    it('should return a POST 200 and returns the created guardian with bio', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            service: faker.company.bsBuzz(),
            phoneNumber: faker.phone.phoneNumber(),
            bio: faker.lorem.sentence(),

          };
          return superagent.post(`${API_URL}/api/guardians`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(tempGuardian)
            .then((res) => {
              expect(res.status).toEqual(200);
              expect(res.body.firstName).toEqual(tempGuardian.firstName);
              expect(res.body.lastName).toEqual(tempGuardian.lastName);
              expect(res.body.email).toEqual(tempUser.user.email);
              expect(res.body.city).toEqual(tempGuardian.city);
              expect(res.body.state).toEqual(tempGuardian.state);
              expect(res.body.service).toEqual(tempGuardian.service);
              expect(res.body.phoneNumber).toEqual(tempGuardian.phoneNumber);
              expect(res.body.bio).toEqual(tempGuardian.bio);
              expect(res.body.userID).toEqual(tempUser.user._id);
            });
        });
    });
    it('should return a POST 400 due to missing first name', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            lastName: faker.name.lastName(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            service: faker.company.bsBuzz(),
            phoneNumber: faker.phone.phoneNumber(),

          };
          return superagent.post(`${API_URL}/api/guardians`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(tempGuardian)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
    it('should return a POST 400 due to missing last name', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            firstName: faker.name.firstName(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            service: faker.company.bsBuzz(),
            phoneNumber: faker.phone.phoneNumber(),

          };
          return superagent.post(`${API_URL}/api/guardians`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(tempGuardian)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
    it('should return a POST 400 due to missing city', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            state: faker.address.stateAbbr(),
            service: faker.company.bsBuzz(),
            phoneNumber: faker.phone.phoneNumber(),

          };
          return superagent.post(`${API_URL}/api/guardians`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(tempGuardian)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
    it('should return a POST 400 due to missing state', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            city: faker.address.city(),
            service: faker.company.bsBuzz(),
            phoneNumber: faker.phone.phoneNumber(),

          };
          return superagent.post(`${API_URL}/api/guardians`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(tempGuardian)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
    it('should return a POST 400 due to missing service', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            phoneNumber: faker.phone.phoneNumber(),

          };
          return superagent.post(`${API_URL}/api/guardians`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(tempGuardian)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
    it('should return a POST 400 due to missing phone number', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            service: faker.company.bsBuzz(),

          };
          return superagent.post(`${API_URL}/api/guardians`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(tempGuardian)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
    it('should return a POST 400 due to missing email', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            service: faker.company.bsBuzz(),
            phoneNumber: faker.phone.phoneNumber(),

          };
          return superagent.post(`${API_URL}/api/guardians`)
            .set('Authorization', `Bearer ${user.token}`)
            .send(tempGuardian)
            .catch((res) => {
              expect(res.status).toEqual(400);
            });
        });
    });
    // it('should return a POST 400 due to missing userid', () => {
    //   let tempUser;
    //   return mockUser.createOne()
    //     .then((user) => {
    //       tempUser = user;
    //       let tempGuardian = {
    //         firstName: faker.name.firstName(),
    //         lastName: faker.name.lastName(),
    //         city: faker.address.city(),
    //         state: faker.address.stateAbbr(),
    //         service: faker.company.bsBuzz(),
    //         phoneNumber: faker.phone.phoneNumber(),
    //       };
    //       return superagent.post(`${API_URL}/api/guardians`)
    //         .set('Authorization', `Bearer ${user.token}`)
    //         .send(tempGuardian)
    //         .catch((res) => {
    //           expect(res.status).toEqual(400);
    //         });
    //     });
    // });
    it('should return a POST 401 due to no authorization provided', () => {
      let tempUser;
      return mockUser.createOne()
        .then((user) => {
          tempUser = user;
          let tempGuardian = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            city: faker.address.city(),
            state: faker.address.stateAbbr(),
            service: faker.company.bsBuzz(),
            phoneNumber: faker.phone.phoneNumber(),

          };
          return superagent.post(`${API_URL}/api/guardians`)
            .send(tempGuardian)
            .catch((res) => {
              expect(res.status).toEqual(401);
            });
        });
    });
  });
});
