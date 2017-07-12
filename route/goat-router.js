'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Goat = require('../model/goat.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const s3Upload = require('../lib/s3-upload-middleware.js');

const goatRouter = module.exports = new Router();

goatRouter.post('/api/goats', bearerAuth, s3Upload('image'), (req, res, next) => {
  new Goat({
    address: req.body.address,
    address2: req.body.address2,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode,
    photoURI: req.s3Data.Location,
    story: req.body.story,
    name: req.body.name,
    gender: req.body.gender,
    breed: req.body.breed,
    weight: req.body.weight,
    age: req.body.age,
    userID: req.user._id.toString(),
    guardianID: req.body.guardianID,
  })
    .save()
    .then(data => res.json(data))
    .catch(next);
});

goatRouter.get('/api/goats/:id', bearerAuth, (req, res, next) => {
  Goat.findById(req.params.id)
    .then(data => {
      if(!data)
        throw new Error('objectid failed: guardian not found');
      return res.json(data);
    })
    .catch(next);
});

goatRouter.put('/api/goats/:id', jsonParser, bearerAuth, (req, res, next) => {
  let keys = Object.keys(req.body);
  if (keys.length < 1)
    return res.sendStatus(400);
  let options = {
    runValidators: true,
    new: true,
  };
  Goat.findByIdAndUpdate(req.params.id, req.body, options)
    .then(data => res.json(data))
    .catch(next);
});

goatRouter.delete('/api/goats/:id', bearerAuth, (req, res, next) => {
  Goat.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
