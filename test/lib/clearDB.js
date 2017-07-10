'use strict';

const User = require('../../model/user.js');
const Guardian = require('../../model/guardian.js');
const Goat = require('../../model/goat.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
    Guardian.remove({}),
    Goat.remove({}),
  ]);
};
