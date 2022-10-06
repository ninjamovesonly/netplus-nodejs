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
        res.status(401).send({
          success: "false",
          message: "Unauthorized",
        });
      }
    } catch (error) {
      res.status(500).send({
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
route.post("/api/event/update", authenticate, controllers.updateEvent);
route.get("/api/events", authenticate, controllers.getEvents);
route.get("/api/events/past", authenticate, controllers.getPastEvents);
route.get("/api/events/search", controllers.searchEvents);
route.get("/api/event/:id", controllers.getEvent);
route.post("/api/event/:id", controllers.updateEvent);
route.delete("/api/event/:id", controllers.deleteEvent);

//Price routes
route.post("/api/price/create", controllers.createPrice);
route.post("/api/price/update", controllers.updatePrice);
route.get("/api/prices/:id", controllers.getPrices);
route.get("/api/price/:id", controllers.getPrice);

//Gallery routes
route.post("/api/gallery/create", controllers.createGallery);
route.post("/api/gallery/update", controllers.updateGallery);
route.get("/api/galleries/:id", controllers.getGalleries);
route.get("/api/gallery/:id", controllers.getGallery);
route.delete("/api/gallery/:id", controllers.deleteGallery);

//Attendee routes
route.post("/api/attendee/create", controllers.createAttendee);
route.post("/api/attendee/update", controllers.updateAttendee);
route.get("/api/attendees/:id", controllers.getAttendees);
route.get("/api/attendee/:id", controllers.getAttendee);

module.exports = route;
