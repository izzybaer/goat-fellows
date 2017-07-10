'use strict';

const Guardian = require('../model/guardian.js');

module.exports = (req, res, next) => {

  Guardian.findOne({userID: req.body.userID})

    .exec(function(err, guardian) {
      if(err) throw new Error('objectid failed');
      req.body.guardianID = guardian._id;
    });
};
