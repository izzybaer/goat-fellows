'use strict';

const faker = require('faker');
const Goat = require('../../model/goat.js');
const mockGuardian = require('./mock-guardian.js');
const mockGoat = module.exports = {};

mockGoat.createOne = () => {
  let result = {};
  return mockGuardian.createOne()
    .then((guardAndUserData) => {
      result = guardAndUserData;
      return new Goat({
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        photoURI: 'test/test-assets/goat.jpg',
        story: faker.lorem.sentence(),
        userID: guardAndUserData.user.user._id.toString(),
        guardianID: guardAndUserData.guardian._id.toString(),
      })
        .save();
    })
    .then((goat) => {
      result.goat = goat;
      return result;
    });
};
