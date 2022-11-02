"use strict";
require("dotenv").config();

const { Event, Attendee, EventUrl, Price } = require("../models");
const logger = require("../util/log");
const _ = require('lodash');


const arenaChat = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  try {
    let event_url = {};
    const event_chip_id = req.params.id;
    const url = await EventUrl.findOne({
      where: { event_id: event_chip_id }
    });
    event_url = { ...url.dataValues }

    const attendee = await Attendee.findOne({
      where: { token: req.body.token }
    });
    event_url.attendee = attendee;
    if(attendee){
      await EventUrl.update({ event_attendee_id: attendee.id }, {
        where: { event_id: event_chip_id }
      });
    }
    event_url.attendee = attendee;

    const event = await Event.findOne({
      where: { id: attendee.event_id }
    });
    event_url.event = event;

    const price = await Price.findOne({
      where: { id: attendee.event_price_id }
    })
    event_url.price = price;

    res.status(200).send({ success: 'true', data: { event_url } })
  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: "An error occurred" });
  }
};

module.exports = {
    arenaChat
};
