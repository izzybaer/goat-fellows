'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');
const faker = require('faker');

const clearDB = require('./lib/clearDB.js');
const mockGuardian = require('./lib/mock-guardian.js');

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
      return mockUser.createOne()
        .then((user) => {
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
      return mockUser.createOne()
        .then((user) => {
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
      return mockUser.createOne()
        .then((user) => {
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
      return mockUser.createOne()
        .then((user) => {
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
      return mockUser.createOne()
        .then((user) => {
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
      return mockUser.createOne()
        .then((user) => {
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
    it('should return a POST 401 due to no authorization provided', () => {
      return mockUser.createOne()
        .then((user) => {
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

  describe('testing GET for guardian model', () => {
    it('should respond with a 200 and a guardian body', () => {
      let tempData;
      return mockGuardian.createOne()
        .then(data => {
          tempData = data;
          return superagent.get(`${API_URL}/api/guardians/${tempData.guardian._id}`)
            .set('Authorization', `Bearer ${data.user.token}`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body.firstName).toEqual(tempData.guardian.firstName);
              expect(res.body.lastName).toEqual(tempData.guardian.lastName);
              expect(res.body.city).toEqual(tempData.guardian.city);
              expect(res.body.state).toEqual(tempData.guardian.state);
              expect(res.body.service).toEqual(tempData.guardian.service);
              expect(res.body.phoneNumber).toEqual(tempData.guardian.phoneNumber);
              expect(res.body.email).toEqual(tempData.guardian.email);
              expect(res.body.userID).toEqual(tempData.guardian.userID);
            });
        });
    });

    it('should respond with a 404 bad id', () => {
      return mockGuardian.createOne()
        .then(data => {
          return superagent.get(`${API_URL}/api/guardians/srghrtydrth`)
            .set('Authorization', `Bearer ${data.user.token}`)
            .catch(res => {
              expect(res.status).toEqual(404);
            });
        });
    });

    it('should respond with a 401 bad Auth', () => {
      let tempData;
      return mockGuardian.createOne()
        .then(data => {
          tempData = data;
          return superagent.get(`${API_URL}/api/guardians/${tempData.guardian._id}`)
            .set('derp', `Bearer ${data.user.token}`)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });

    it('should respond with a 401 bad Bearer', () => {
      let tempData;
      return mockGuardian.createOne()
        .then(data => {
          tempData = data;
          return superagent.get(`${API_URL}/api/guardians/${tempData.guardian._id}`)
            .set('Authorization', `derp ${data.user.token}`)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });

    it('should respond with a 401 missing token', () => {
      let tempData;
      return mockGuardian.createOne()
        .then(data => {
          tempData = data;
          return superagent.get(`${API_URL}/api/guardians/${tempData.guardian._id}`)
            .set('Authorization', `Bearer `)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
  });

  describe.only('Testing /api/guardians PUT' , () => {
    it('Should respond with a 200 and the updated guardian', () => {
      let tempData;
      let tempGuardian = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        service: faker.company.bsBuzz(),
        phoneNumber: faker.phone.phoneNumber(),
        bio: faker.lorem.sentence(),
      };
      return mockGuardian.createOne()
        .then(data => {
          tempData = data;
          return superagent.put(`${API_URL}/api/guardians/${tempData.guardian._id}`)
            .set(`Authorization`, `Bearer ${data.user.token}`)
            .send(tempGuardian);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.firstName).toEqual(tempGuardian.firstName);
          expect(res.body.lastName).toEqual(tempGuardian.lastName);
          expect(res.body.city).toEqual(tempGuardian.city);
          expect(res.body.state).toEqual(tempGuardian.state);
          expect(res.body.service).toEqual(tempGuardian.service);
          expect(res.body.phoneNumber).toEqual(tempGuardian.phoneNumber);
          expect(res.body.bio).toEqual(tempGuardian.bio);
          expect(res.body.email).toEqual(tempData.guardian.email);
          expect(res.body.userID).toEqual(tempData.guardian.userID);
        });
    });

    it('Should respond with a 400 bad values', () => {
      let tempData;
      return mockGuardian.createOne()
        .then(data => {
          tempData = data;
          return superagent.put(`${API_URL}/api/guardians/${tempData.guardian._id}`)
            .set(`Authorization`, `Bearer ${data.user.token}`)
            .send({});
        })
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    it('Should respond with a 400 bad id', () => {
      return mockGuardian.createOne()
        .then(data => {
          return superagent.put(`${API_URL}/api/guardians/regdfggerg`)
            .set(`Authorization`, `Bearer ${data.user.token}`)
            .send({});
        })
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    it('Should respond with a 401 bad bearer', () => {
      let tempData;
      return mockGuardian.createOne()
        .then(data => {
          tempData = data;
          return superagent.put(`${API_URL}/api/guardians/${tempData.guardian._id}`)
            .set(`Authorization`, `derp ${data.user.token}`)
            .send({});
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    it('Should respond with a 401 no token', () => {
      let tempData;
      return mockGuardian.createOne()
        .then(data => {
          tempData = data;
          return superagent.put(`${API_URL}/api/guardians/${tempData.guardian._id}`)
            .set(`Authorization`, `Bearer `)
            .send({});
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });
});
