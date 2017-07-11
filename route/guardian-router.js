'use strict';

const {Router} = require('express');

const jsonParser = require('body-parser').json();
const Guardian = require('../model/guardian.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const guardianRouter = module.exports = new Router();

guardianRouter.post('/api/guardians', jsonParser, bearerAuth, (req, res, next) => {
  new Guardian(req.body)
    .save()
    .then(data => res.json(data))
    .catch(next);
});

guardianRouter.get('/api/guardians/:id', bearerAuth, (req, res, next) => {
  Guardian.findById(req.params.id)
    .then(data => res.json(data))
    .catch(next);
});

guardianRouter.put('/api/guardians/:id', bearerAuth, jsonParser, (req, res, next) => {
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
