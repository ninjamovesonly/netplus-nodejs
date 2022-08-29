const { Router } = require("express");
const controllers = require("../controllers");

const route = Router();

//Event routes
route.post("/api/event/create", controllers.createEvent);
route.get("/api/events", controllers.getEvents);
route.get("/api/event/:id", controllers.getEvent);
route.post("/api/event/:id", controllers.updateEvent);
route.delete("/api/event/:id", controllers.deleteEvent);

//Price routes
route.post("/api/price/create", controllers.createPrice);
route.post("/api/price/update", controllers.updatePrice);
route.get("/api/prices/:id", controllers.getPrices);
route.get("/api/price/:id", controllers.getPrice);

//Upload routes
route.post("/api/upload/image/:id", controllers.uploadImage);
route.post("/api/upload/document/:id", controllers.uploadFile);
route.get("/api/upload/relative/:id", controllers.getFileByRelative);
route.get("/api/upload/:id", controllers.getFileById);

module.exports = route;
