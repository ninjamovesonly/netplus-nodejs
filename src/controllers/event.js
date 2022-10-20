"use strict";

const { Op } = require("sequelize");
const { Event, Price, Gallery } = require("../models");
const { guid } = require("../util");
const { getPrices } = require("../models/price");
const { getGallery } = require("../models/gallery");
const { getAttendees } = require("../models/attendee");
const logger = require("../util/log");

const createEvent = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Create Event'
    #swagger.security = [{
               "apikey": []
        }]
    #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                      $image: "string",
                      $title: "string",
                      $description: "string",
                      $image: "string",
                      $location: "string",
                      $user_id: "string",
                      $start_date: "datetime",  
                      $end_date: "datetime",  
                      $gallery: "array",
                      $prices: "array"
                }
        }
  */

  try {
    const event = await Event.create({
      user_id: req?.isce_auth?.user_id,
      image: req.body.image,
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    });

    let response, status;
    if (event?.id) {

      const prices = req.body?.prices;
      if(prices?.length > 0){
        prices.forEach(async (price) => {
          await Price.create({ 
            id: guid(), event_id: event.id, ...price, order_amount: 0 
          });
        });
      }

      const gallery = req.body?.gallery;
      if (gallery?.length > 0){
        gallery.forEach(async (item) => {
          await Gallery.create({ 
            id: guid(), event_id: event.id, ...item 
          });
        });
      }

      status = 200;
      response = {
        success: "true",
        message: "Event created successfully",
        data: event,
      };
    } else {
      status = 404;
      response = { success: "false", message: "Unable to save event" };
    }

    res.status(status).send(response);
  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: error?.message });
  }
};

const updateEvent = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Update Event'
     #swagger.security = [{
               "apikey": []
        }]
     #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                      $title: "string",
                      $description: "string",
                      $image: "string",
                      $location: "string",
                      $start_date: "datetime",  
                      $end_date: "datetime",  
                }
        }
  */

  try {
    await Event.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    const event = await Event.findOne({ 
      where: { 
        id: req?.params?.id
      } 
    });

    const prices = req.body?.prices;
    if(prices?.length > 0){
      await Price.destroy({
        where: {
          event_id: event?.id
        }
      });

      prices.forEach(async (price) => {
        await Price.create({ 
          id: guid(), event_id: event?.id, ...price, order_amount: 0 
        });
      });
    }

    const gallery = req.body?.gallery;
    if (gallery?.length > 0){
      await Gallery.destroy({
        where: {
          event_id: event?.id
        }
      });

      gallery.forEach(async (item) => {
        await Gallery.create({
          id: guid(), event_id: event?.id, ...item
        });
      });
    }

    res.send({
      success: "true",
      data: { event },
    });
  } catch (error) {
    logger(error);
    res.send({ success: "false", message: "An error has occurred" });
  }
};

const deleteEvent = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Delete event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  try {
    if(!req?.params?.id){
      res.status(404).send({
        success: "false",
        message: "Invalid event id",
      });
    }

    const event = await Event.destroy({
      where: {
        id: req.params.id,
      },
    });

    if(!event){
      res.status(404).send({
        success: "false",
        message: "Event not available",
      });
    }
  
    res.status(200).send({
      success: "true",
      message: "Event deleted",
    });
  } catch (error) {
    logger(err);
    res.status(500).send({ success: "false", message: "An error occurred" });
  }
};

const getEvents = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Events'
     #swagger.security = [{
               "apikey": []
        }]
  */
  try {
    let offset = 0,
    page = Number(req.query.page) || 1,
    limit = Number(req.query.limit) || 100;
    if (page > 1) {
      offset = limit * page;
      offset = offset - limit;
    }
    
    const events = await Event.findAll({
      limit,
      offset,
      where: {
        user_id: {
          [Op.eq]: req.isce_auth.user_id,
        }
      }
    });

    const updatedEvents = await Promise.all(events?.map(async (event) => {
      const item = event.dataValues;
      const prices = await getPrices(item.id);
      const gallery = await getGallery(item.id);
      const attendees = await getAttendees(item.id);
      return { ...item, prices, gallery, attendees };
    })); 

    const yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
    const past = updatedEvents.filter(({ start_date }) => new Date(start_date) < yesterday);
    const upcoming = updatedEvents.filter(({ start_date }) => new Date(start_date) >= yesterday);

    res.status(200).send({
      success: "true",
      data: {
        count: updatedEvents?.length,
        all: updatedEvents,
        upcoming,
        past
      },
    });
  } catch (error) {
    logger(error);
    res.status(500).send({
      success: 'false', message: 'A server error occurred'
    });
  }
};

const searchEvents = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Search events using title or description'
     #swagger.security = [{
               "apikey": []
        }]
  */
  
  try {
    let offset = 0,
    page = Number(req.query.page) || 1,
    limit = Number(req.query.limit) || 100,
    query = req.query.query;

    if (page > 1) {
      offset = limit * page;
      offset = offset - limit;
    }

    const events = await Event.findAll({
      limit,
      offset,
      where: {
        [Op.or]: [
          { title: { [Op.like]: query } },
          { description: { [Op.like]: query } },
        ],
        title: { [Op.like]: query },
        start_date: {
          [Op.gte]: new Date(),
        },
      },
    });

    res.status(200).send({ success: "true", data: { events } });
  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: "an error occurred" })
  }
};

const getEvent = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  try {
    const event = await Event.findOne({ 
      where: { 
        id: req?.params?.id,
        user_id: req?.isce_auth?.user_id 
      } 
    });

    if(!event?.id){
      res.status(404).send({ success: "false", message: "No data found" });
    }else{
      const yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
      const past = (new Date(event?.start_date) < yesterday);

      const prices = await getPrices(event.id);
      const gallery = await getGallery(event.id);
      const attendees = await getAttendees(event.id);
      const data = { ...event.dataValues, gallery, prices, attendees, past };

      res.status(200).send({ success: "true", data });
    }
  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: "An error occurred" });
  }
};

const getRequestedCards = async (req, res) => {
  //receives event_id, requested card number, event_price_id

  try {
    let price = await Price.findOne({
      where: {
        id: req.body?.event_price_id,
      },
    });

    const updatedOrder = +req?.body?.order_amount + price?.order_amount;
    if(updatedOrder > price?.attendees){
      res.send({
        success: "false",
        message: "Maximum amount reached"
      });
    }else{
      /* NEEDS UPDATE */
      //send a mail to isce indicating that a card request has been made
        //mail will contain user details, event details, and the total cost of cards

      //send a mail to user indicating that they will receive the cards soon
          //mail will contain user details, event details, and the total cost of cards

      //update price table

      await Price.update({ order_amount: updatedOrder }, {
        where: {
          id: req.body?.event_price_id,
        },
      });

      res.send({
        success: "true",
        message: "Updated successfully",
        data: { order_amount: updatedOrder }
      });
    }
  } catch (error) {
    logger(error)
    res.send({
      success: "false",
      message: "Unable to update data"
    });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  searchEvents,
  getEvent,
  getRequestedCards
};
