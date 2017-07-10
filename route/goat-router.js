'use strict';

const {Router} = require('express');

const jsonParser = require('body-parser').json();
const Guardian = require('../model/guardian.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const getGuardian = require('../lib/get-guardian-middleware.js');

const goatRouter = module.exports = new Router();

goatRouter.post('/api/guardian', bearerAuth, getGuardian, jsonParser, (req, res, next) => {
  console.log('req.body', req.body);
  new Guardian(req.body)
    .save()
    .then(data => res.json(data))
    .catch(next);
});

goatRouter.get('/api/guardian/:id', bearerAuth, (req, res, next) => {
  Guardian.findById(req.params.id)
    .then(data => res.json(data))
    .catch(next);
});

goatRouter.put('/api/guardian/:id', bearerAuth, getGuardian, jsonParser, (req, res, next) => {
  let options = {
    runValidators: true,
    new: true,
  };
  Guardian.findByIdAndUpdate(req.params.id, req.body, options)
    .then(data => res.json(data))
    .catch(next);
});

goatRouter.delete('/api/guardian/:id', bearerAuth, getGuardian, (req, res, next) => {
  Guardian.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
