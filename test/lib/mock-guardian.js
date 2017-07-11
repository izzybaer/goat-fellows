'use strict';

const faker = require('faker');
const Guardian = require('../../model/guardian.js');
const mockUser = require('./mock-user.js');
const mockGuardian = module.exports = {};

mockGuardian.createOne = () => {
  let result = {};
  return mockUser.createOne()
    .then((userData) => {
      result.user = userData;
      return new Guardian({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        service: faker.company.bsBuzz(),
        phoneNumber: faker.phone.phoneNumber(),
        userID: userData.user._id.toString(),
      })
        .save();
    })
    .then(guardian => {
      result.guardian = guardian;
      return result;
    });
};
