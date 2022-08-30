const { default: axios } = require("axios");
const { Router } = require("express");
const controllers = require("../controllers");
const config = require("../config");
const authenticate = (req, res, next) => {
    async function authenticateCheck(){
       const token = req.header('Authorization');
       try {
           const { data: auth } = await axios.post(config.auth.url + '/api/user-profile', {}, {
               headers: {
                   'Content-type': 'application/json',
                   'Authorization': token
               }
           });
           if(auth.success === 'true'){
               req.isce_auth = auth?.data?.user;
               next();
           }
       } catch (error) {
           res.json({
               success: 'false',
               message: 'Unauthorized'
           })
       }
    }
    authenticateCheck();
  };
const route = Router();

//Event routes
route.post("/api/event/create", authenticate, controllers.createEvent);
route.post("/api/event/update", controllers.updateEvent);
route.get("/api/events", controllers.getEvents);
route.get("/api/event/:id", controllers.getEvent);

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
