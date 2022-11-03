"use strict";
require("dotenv").config();

const { Event, Attendee, EventUrl, Price, EventChat } = require("../models");
const logger = require("../util/log");
const _ = require('lodash');


const saveArenaChat = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  try {
    const form = _.pick(req.body,['event_id', 'attendee_id', 'text']);

    await EventChat.create({
        id: guid(),
        ip: paystack?.access_code,
        authorization_url: paystack?.authorization_url,
        reference: paystack?.reference,
        metadata: JSON.stringify(form)
      });

  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: "An error occurred" });
  }
};

const getArenaChat = async (req, res) => {
    /*
      #swagger.tags = ["Event"]
      #swagger.description = 'Get Event by id'
       #swagger.security = [{
                 "apikey": []
          }]
    */
  
    try {
        const chats = await EventChat.findAll({ where: { id: req?.body?.event_id }});
        if(!chats){
            return res.status(404).send({ success: "false", message: "No chats yet" })
        }

        return res.status(200).send({ success: "true", data: { chats } })  
    } catch (error) {
      logger(error);
      res.status(500).send({ success: "false", message: "An error occurred" });
    }
  };

module.exports = {
    saveArenaChat,
    getArenaChat
};
