const express = require('express');
const FareController = require('./model_deployment/controllers/FareController');

const fareRouter = express.Router();
const fareController = new FareController();

fareRouter.post('/predict', fareController.getFare.bind(fareController));

module.exports = {
  name: 'fare',
  route: fareRouter,
};
