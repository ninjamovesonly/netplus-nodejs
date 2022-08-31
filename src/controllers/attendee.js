"use strict";

const { Op } = require("sequelize");
const { Attendee } = require("../models");
const logger = require("../util/log");

const createAttendee = async (req, res) => {
  /*
    #swagger.tags = ["Attendee"]
    #swagger.description = 'Create Attendee'
    #swagger.security = [{
               "apikey": []
        }]
    #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                      $event_id: "string",
                      $image: "string",
                      $name: "string",
                      $email: "string",
                      $phone: "string",
                      $price_category: "string",
                }
        }
  */

  await Attendee.create(req.body)
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const updateAttendee = async (req, res) => {
  /*
    #swagger.tags = ["Attendee"]
    #swagger.description = 'Update Attendee'
     #swagger.security = [{
               "apikey": []
        }]
    #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                      $event_id: "string",
                      $image: "string",
                      $name: "string",
                      $email: "string",
                      $phone: "string",
                      $price_category: "string",
                }
        }
  */

  await Attendee.update(req.body, {
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

const getAttendees = async (req, res) => {
  /*
    #swagger.tags = ["Attendee"]
    #swagger.description = 'Get Attendees by event_id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  await Attendee.findAll({ event_id: req.params.id })
    .then((data) => {
      res.send({ success: true, data });
    })
    .catch((err) => logger(err));
};

const getAttendee = (req, res) => {
  /*
    #swagger.tags = ["Attendee"]
    #swagger.description = 'Get single attendee by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  Attendee.findOne({ where: { id: req.params.id } })
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
  createAttendee,
  updateAttendee,
  getAttendees,
  getAttendee,
};
