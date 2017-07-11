'use strict';

const {Router} = require('express');

const jsonParser = require('body-parser').json();
const Guardian = require('../model/guardian.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const guardianRouter = module.exports = new Router();

guardianRouter.post('/api/guardians', jsonParser, bearerAuth, (req, res, next) => {
  new Guardian({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.user.email,
    city: req.body.city,
    state: req.body.state,
    service: req.body.service,
    phoneNumber: req.body.phoneNumber,
    userID: req.user._id.toString(),
  })
    .save()
    .then(data => res.json(data))
    .catch(next);
});

guardianRouter.get('/api/guardians/:id', bearerAuth, (req, res, next) => {
  Guardian.findById(req.params.id)
    .then(data => res.json(data))
    .catch(next);
});

guardianRouter.put('/api/guardians/:id', jsonParser, bearerAuth, (req, res, next) => {
  let options = {
    runValidators: true,
    new: true,
  };
  Guardian.findByIdAndUpdate(req.params.id, req.body, options)
    .then(data => res.json(data))
    .catch(next);
});

guardianRouter.delete('/api/guardians/:id', bearerAuth, (req, res, next) => {
  Guardian.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
