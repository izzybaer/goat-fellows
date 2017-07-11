'use strict';

const faker = require('faker');
const Goat = require('../../model/goat.js');
const mockGuardian = require('./mock-guardian.js');
const mockGoat = module.exports = {};

mockGoat.createOne = () => {
  let result = {};
  return mockGuardian.createOne()
    .then((guardian) => {
      console.log('guardian', guardian);
      result.guardian = guardian;
      return new Goat({
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        address: faker.address.streetAddress(),
        photoURI: faker.image.avatar(),
        story: faker.lorem.sentence(),
        userID: guardian.userID,
        guardianID: result.guardian._id,
      });
    });
};

mockGoat.createMany = (n) => {
  let result = {};
  return mockGuardian.createOne()
    .then(guardian => {
      result.guardian = guardian;
      let goatsToSave = new Array(n).fill(0).map(() => new Goat({
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        address: faker.address.streetAddress(),
        photoURI: faker.image.avatar(),
        story: faker.lorem.sentence(),
        userID: result.user._id,
        guardianID: result.guardian._id,
      }).save());
      return Promise.all(goatsToSave);
    })
    .then(goats => {
      result.goats = goats;
      return result;
    });
};
