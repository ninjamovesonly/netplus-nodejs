const { Router } = require("express");
const controllers = require("../controllers");

const route = Router();

route.get("/", controllers.helloWorld);

module.exports = route;
