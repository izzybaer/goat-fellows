'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const basicAuth = require('../lib/auth-middleware.js');
const User = require('../model/user.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const authRouter = module.exports = new Router();

authRouter.post('/api/signup', jsonParser, (req, res, next) => {
  if(!req.body.password || !req.body.username){
    return next(new Error('Invalid body'));
  }
  User.create(req.body)
    .then(token => res.send(token))
    .catch(next);
});

authRouter.get('/api/login', basicAuth, (req, res, next) => {

  req.user.tokenCreate()
    .then(token => res.send(token))
    .catch(next);
});

authRouter.put('/api/users/:id', jsonParser, bearerAuth, (req, res, next) => {
  let keys = Object.keys(req.body);
  if (keys.length < 1)
    return res.sendStatus(400);
  let options = {
    runValidators: true,
    new: true,
  };
  User.findByIdAndUpdate(req.params.id, req.body, options)
    .then(data => res.json(data))
    .catch(next);
});

authRouter.delete('/api/users/:id', bearerAuth, (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
