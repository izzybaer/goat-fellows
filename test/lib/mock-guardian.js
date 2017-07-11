'use strict';

const faker = require('faker');
const Guardian = require('../../model/guardian.js');
const mockUser = require('./mock-user.js');
const mockGuardian = module.exports = {};

mockGuardian.createOne = () => {
  let result = {};
  return mockUser.createOne()
    .then((user) => {
      result.user = user;
      return new Guardian({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        city: faker.address.city(),
        state: faker.random.us_state_abbr(),
        service: faker.random.bs_buzz(),
        phoneNumber: faker.PhoneNumber.phoneNumber(),
        userID: result.user._id.toString(),
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
        state: faker.random.us_state_abbr(),
        service: faker.random.bs_buzz(),
        phoneNumber: faker.PhoneNumber.phoneNumber(),
        userID: result.user._id.toString(),
      }).save());
      return Promise.all(guardiansToSave);
    })
    .then(guardians => {
      result.guardians = guardians;
      return result;
    });
};
