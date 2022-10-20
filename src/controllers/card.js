"use strict";

const { Op } = require("sequelize");
const { Event } = require("../models");
const { getPrices } = require("../models/price");
const { getGallery } = require("../models/gallery");
const { getAttendees } = require("../models/attendee");
const logger = require("../util/log");

const cardGetEvents = async (req, res) => {
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
    
    console.log(req?.params?.id)
    const events = await Event.findAll({
      limit,
      offset,
      where: {
        user_id: {
          [Op.eq]: req?.params?.id,
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

    const past = updatedEvents.filter(({ start_date }) => new Date(start_date) < new Date());
    const upcoming = updatedEvents.filter(({ start_date }) => new Date(start_date) >= new Date());

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

const cardSearchEvents = async (req, res) => {
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

const cardGetEvent = async (req, res) => {
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
    }

    const prices = await getPrices(event.id);
    const gallery = await getGallery(event.id);
    const attendees = await getAttendees(event.id);
    const data = { ...event.dataValues, gallery, prices, attendees };

    res.status(200).send({ success: "true", data });
  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: "An error occurred" });
  }
};

const cardRegisterEvent = async (req, res) => {
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
    }

    const prices = await getPrices(event.id);
    const gallery = await getGallery(event.id);
    const attendees = await getAttendees(event.id);
    const data = { ...event.dataValues, gallery, prices, attendees };

    res.status(200).send({ success: "true", data });
  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: "An error occurred" });
  }
};

module.exports = {
  cardGetEvents,
  cardSearchEvents,
  cardGetEvent
};
