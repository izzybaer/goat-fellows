'use strict';

const faker = require('faker');
const Guardian = require('../../model/guardian.js');
const mockUser = require('./mock-user.js');
const mockGuardian = module.exports = {};

mockGuardian.createOne = () => {
  return mockUser.createOne()
    .then((userData) => {
      console.log('userData', userData);
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
    });
};

mockGuardian.createMany = (n) => {
  let result = {};
  return mockUser.createOne()
    .then(user => {
      result.user = user;
      let guardiansToSave = new Array(n).fill(0).map(() => new Guardian({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        service: faker.company.bsBuzz(),
        phoneNumber: faker.phone.phoneNumber(),
        userID: result.user._id.toString(),
      }).save());
      return Promise.all(guardiansToSave);
    })
    .then(guardians => {
      result.guardians = guardians;
      return result;
    });
};
