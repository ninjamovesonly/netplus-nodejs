"use strict";
require("dotenv").config();

const { EventChat, Event, Attendee } = require("../models");
const logger = require("../util/log");
const _ = require('lodash');
const { guid } = require("../util");
const { sendThankyouMail } = require("../util/mailer2");


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
        let chats = await EventChat.findAll({ where: { id: req?.body?.event_id }});
        if(!chats){
            return res.status(404).send({ success: "false", message: "No chats yet" })
        }

        chats = chats?.sort(function(a, b) {
          return (a?.updatedAt < b?.updatedAt) ? -1 : ((a?.updatedAt > b?.updatedAt) ? 1 : 0);
        });

        return res.status(200).send({ success: "true", data: { chats } })  
    } catch (error) {
      logger(error);
      res.status(500).send({ success: "false", message: "An error occurred" });
    }
  };

const sendEndOfEventMails = async (req, res) => {
  //get request event
  const event_id = '93bdf168-7f45-4265-bfc4-dd05fb8e1a5e'; //req?.params?.id

  const event = await Event.findOne({
    where: {
      id: event_id
    }
  });
  return res.status(200).send({ success: "false", event })

  if(!event){
    return res.status(200).send({ success: "false", message: "No event found" })
  }

  const attendees = Attendee.findAll({
    where: {
      event_id: event?.id
    }
  });

  if(!attendees){
    return res.status(200).send({ success: "false", message: "No events attendees" })
  }

  const sendMails = await Promise.all(attendees?.map(async (user) => {
    const attendee = user?.dataValues;
    if(!attendee?.thankyou_mail){
      const mail = sendThankyouMail({
          from: `${ event?.title } <event@isce.app>`,
          to: attendee?.email,
          subject: event?.title + ': Thank you for coming',
          data: {
            attendee,
            event
          }
      });

      await Attendee.update({ thankyou_mail: true }, {
        where: {
          id: attendee?.id
        }
      });
      return !mail;
    }
    return true;
  })); 

  if(sendMails?.length > 0){
    return res.status(200).send({ success: "false", message: sendMails?.length + " were not sent of " + attendees?.dataValues?.length })
  }

  return res.status(200).send({ success: "true", message: "All Emails sent" });
}

module.exports = {
    saveArenaChat,
    getArenaChat,
    sendEndOfEventMails
};
