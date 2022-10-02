const { default: axios } = require("axios");
const { Router } = require("express");
const controllers = require("../controllers");
const config = require("../config");

const authenticate = (req, res, next) => {
  async function authenticateCheck() {
    const token = req.header("Authorization");
    try {
      const { data: auth } = await axios.post(
        config.auth.url + "/api/user-profile",
        {},
        {
          headers: {
            "Content-type": "application/json",
            Authorization: token,
          },
        }
      );

      if (auth.success === "true") {
        req.isce_auth = auth?.data?.user;
        next();
      } else {
        res.json({
          success: "false",
          message: "Unauthorized",
        });
      }
    } catch (error) {
      res.json({
        error,
        success: "false",
        message: "Unauthorized",
      });
    }
  }
  authenticateCheck();
};

const route = Router();

//Event routes

route.post("/api/event/create", authenticate, controllers.createEvent);
route.post("/api/event/update", controllers.updateEvent);
route.get("/api/events", controllers.getEvents);
route.get("/api/events/past", controllers.getPastEvents);
route.get("/api/events/search", controllers.searchEvents);
route.get("/api/event/:id", controllers.getEvent);
route.post("/api/event/:id", controllers.updateEvent);
route.delete("/api/event/:id", controllers.deleteEvent);

//Price routes
route.post("/api/price/create", controllers.createPrice);
route.post("/api/price/update", controllers.updatePrice);
route.get("/api/prices/:id", controllers.getPrices);
route.get("/api/price/:id", controllers.getPrice);

//Attendee routes
route.post("/api/attendee/create", controllers.createAttendee);
route.post("/api/attendee/update", controllers.updateAttendee);
route.get("/api/attendees/:id", controllers.getAttendees);
route.get("/api/attendee/:id", controllers.getAttendee);

//Upload routes
route.post("/api/upload/image/:id", controllers.uploadImage);
route.post("/api/upload/document/:id", controllers.uploadFile);
route.get("/api/upload/relative/:id", controllers.getFileByRelative);
route.get("/api/upload/:id", controllers.getFileById);

module.exports = route;
