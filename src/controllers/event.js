"use strict";

const { Op } = require("sequelize");
const { Event } = require("../models");
const logger = require("../util/log");

const totalCount = async () => {
  let val = await Event.count({
    where: {
      start_date: {
        [Op.lt]: new Date(),
      },
    },
  })
    .then((data) => {
      return data;
    })
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
                      $title: "string",
                      $description: "string",
                      $start_date: "datetime",  
                      $end_date: "datetime",  
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
      id: req.params.id,
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

const deleteEvent = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Delete event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  await Event.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.send({
        success: true,
        message: "Event deleted",
      });
    })
    .catch((err) => logger(err));
};

const getEvents = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Events'
     #swagger.security = [{
               "apikey": []
        }]
  */
  let offset = 0,
    page = Number(req.query.page) || 1,
    limit = Number(req.query.limit) || 100;
  if (page > 1) {
    offset = limit * page;
    offset = offset - limit;
  }

  await totalCount()
    .then(async (total) => {
      await Event.findAll({ limit, offset }).then((data) => {
        res.send({ success: true, data, total });
      });
    })
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

  Event.findOne({ where: { id: req.params.id } })
    .then((data) => {
      if (data) {
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
  deleteEvent,
  getEvents,
  getEvent,
};
