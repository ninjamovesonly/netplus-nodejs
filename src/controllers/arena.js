"use strict";
require("dotenv").config();

const { EventChat, Event } = require("../models");
const logger = require("../util/log");
const _ = require('lodash');
const { guid } = require("../util");


const saveArenaChat = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  try {
    const form = _.pick(req?.body,['event_id', 'attendee_id', 'message', 'image']);

    const event = await Event.findOne({ 
      where: { 
        id: form?.event_id
      } 
    });

    if(!event){
      return res.status(200).send({ success: "false", message: "Invalid event accessed" });
    }

    
    const chat = await EventChat.create({
        id: guid(),
        event_id: form?.event_id,
        attendee_id: form?.attendee_id,
        ip: req?.header('x-forwarded-for') ||  req?.socket?.remoteAddress,
        message: form?.message,
        image: form?.image
    });

    if(!chat){
        return res.status(404).send({ success: "false", message: "Unable to create event" });
    }

    return res.status(200).send({ success: "true", message: "chat created successfully" });
  } catch (error) {
    logger(error);
    return res.status(500).send({ success: "false", message: "An error occurred" });
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
