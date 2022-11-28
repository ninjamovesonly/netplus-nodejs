const { Router } = require("express");
const controllers = require("../controllers");

const route = Router();

route.post("/api/pay/initialize", controllers.AppController.processOrder);

route.get('/v1/checkout/:ref', controllers.AppController.getCardDetails);

route.post('/api/v1/pay', controllers.AppController.processPayment);

route.get('/transactions/requery/:ref', controllers.AppController.requeryUrl);

module.exports = route;