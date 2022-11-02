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

    res.status(500).send({ success: "false", message: "An error occurred" });
};

module.exports = {
    arenaChat
};
