// 'use strict';
//
// require('dotenv').config({path: `${__dirname}/../.test.env`});
// require('./lib/mock-aws.js');
// const superagent = require('superagent');
// const expect = require('expect');
// const faker = require('faker');
//
// const clearDB = require('./lib/clearDB.js');
// const mockGoat = require('./lib/mock-goat.js');
// const mockGuardian = require('./lib/mock-guardian.js');
//
//
// const server = require('../lib/server.js');
// const API_URL = process.env.API_URL;
//
// describe('testing routes for goat model', () => {
//   before(server.start);
//   after(server.stop);
//   afterEach(clearDB);
//
//   describe.only('testing POST /api/goats', () => {
//     it('should return a new goat and respond with 200', () => {
//       let tempData;
//       let tempAddress = faker.address.streetAddress();
//       let tempCity = faker.address.city();
//       let tempState = faker.address.stateAbbr();
//       let tempStory = faker.lorem.sentence();
//       return mockGuardian.createOne()
//         .then((userGoatData) => {
//           tempData = userGoatData;
//           return superagent.post(`${API_URL}/api/goats`)
//             .set('Authorization', `Bearer ${tempData.user.user.token}`)
//             .field('address', tempAddress)
//             .field('city', tempCity)
//             .field('state', tempState)
//             .field('story', tempStory)
//             .field('userID', tempData.user.user._id)
//             .field('guardianID', tempData.guardian._id)
//             .attach('image', `${__dirname}/test-assets/goat.jpg`)
//             .then((res) => {
//               expect(res.status).toEqual(200);
//             });
//         });
//     });
//   });
// });
