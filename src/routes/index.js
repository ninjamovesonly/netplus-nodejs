const { Router } = require("express");
const controllers = require("../controllers");

const route = Router();

//Event routes
route.post("/api/event/create", controllers.createEvent);
route.post("/api/event/update", controllers.updateEvent);
route.get("/api/events", controllers.getEvents);
route.get("/api/event/:id", controllers.getEvent);

//Upload routes
route.post("/api/upload/image/:id", controllers.uploadImage);
route.post("/api/upload/document/:id", controllers.uploadFile);
route.get("/api/upload/relative/:id", controllers.getFileByRelative);
route.get("/api/upload/:id", controllers.getFileById);

module.exports = route;
