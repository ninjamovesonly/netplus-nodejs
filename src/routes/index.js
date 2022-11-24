const { Router } = require("express");
const controllers = require("../controllers");

const route = Router();

route.post("/api/order", controllers.AppController.processOrder);

route.get('/v1/checkout', controllers.AppController.processPayment);

module.exports = route;
