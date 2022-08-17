"use strict";

const { Op, DataTypes } = require("sequelize");
const { Event } = require("../models");
const logger = require("../util/log");

const totalCount = async () => {
  let val = await Event.count({
    where: {
      id: {
        [Op.gt]: Date.now(),
      },
    },
  })
    .then((data) => data.length)
    .catch((err) => logger(err));
  return val;
};

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
                      $event_id: "string",
                      $title: "string",
                      $description: "string",
                      $start_date: "string",  
                      $end_date: "string",  
                      $created_at: "string",
                      $updated_at: "string",
                }
        }
  */

  await Event.create(req.body)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const updateEvent = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Update Event'
     #swagger.security = [{
               "apikey": []
        }]
  */

  await Event.update(req.body, {
    where: {
      event_id: req.body.event_id,
    },
  })
    .then((data) => {
      res.send({
        success: true,
        data,
      });
    })
    .catch((err) => logger(err));
};

const getEvents = (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Events'
     #swagger.security = [{
               "apikey": []
        }]
  */
  let offset = 0,
    page = Number(req.query.page),
    limit = Number(req.query.limit);
  if (page > 1) {
    offset = limit * page;
    offset = offset - limit;
  }

  totalCount()
    .then((count) => {})
    .catch((err) => logger(err));
};

const getEvent = (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  Event.findOne({ where: { event_id: req.params.id } })
    .then((data) => {
      if (data.id) {
        res.send({ success: true, data });
      } else {
        res.send({ success: false, message: "No data" });
      }
    })
    .catch((err) => logger(err));
};

module.exports = {
  createEvent,
  updateEvent,
  getEvents,
  getEvent,
};
