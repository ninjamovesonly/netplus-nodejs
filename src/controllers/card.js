"use strict";

const { Op } = require("sequelize");
const { Event, Attendee, Token, EventUrl, Price, Paystack } = require("../models");
const { getPrices } = require("../models/price");
const { getGallery } = require("../models/gallery");
const { getAttendees } = require("../models/attendee");
const logger = require("../util/log");
const { guid, pastItems, upcomingItems } = require("../util");
const axios = require('axios');
const _ = require('lodash');
const {initializePayment, verifyPayment} = require('../config/paystack')();

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

    let url = 'https://developer.isce.app/v1/connect/api/connect-vcard';
    url = (req.query.id) ? url + `?id=${req.query.id}` : null;
    url = (url && req.query.type) ? url + `&type=${req.query.type}` : null;
    if(!url){
      return res.status(200).send({ success: "true",message: "Invalid request paramters" })
    }
    
    const { data: response } = await axios?.get(url);
    if(response?.success !== 'true'){
      return res.status(200).send({ success: "true",message: "Unable to connect to isce" })
    }
    const user_id = response?.data?.card?.user_id;
    const events = await Event.findAll({
      limit,
      offset,
      where: {
        user_id: {
          [Op.eq]: user_id
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

    const past = pastItems(updatedEvents);
    const upcoming = upcomingItems(updatedEvents);

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

const cardGetOpenEvents = async (req, res) => {
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

    const name = decodeURIComponent(req?.query?.id);
    const event = await Event.findOne({
      limit,
      offset,
      where: {
        clean_name: {
          [Op.eq]: name
        }
      }
    });

    if(!event){
      return res.status(200).send({ success: "false", message: "Unable to retrieve event" });
    }
    
    const item = { ...event.dataValues };
    item.prices = await getPrices(event.id);
    item.gallery = await getGallery(event.id);
    item.attendees = await getAttendees(event.id);

    res.status(200).send({
      success: "true",
      data: {
        count: item?.length,
        event: item
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
      return res.status(404).send({ success: "false", message: "No data found" });
    }

    const prices = await getPrices(event.id);
    const gallery = await getGallery(event.id);
    const attendees = await getAttendees(event.id);
    const data = { ...event?.dataValues, gallery, prices, attendees };

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
    let attendee = await Attendee.findOne({ 
      where: { 
        email: req?.body?.email,
        event_id:  req?.body?.event_id
      }});
    if(attendee){
      return res.status(200).send({ success: "true", link: attendee?.ticket, message: "You are already registered" })
    }
    
    const price = await Price.findOne({ where: { id: req?.body?.event_prices_id }});
    if(!price) {
      return res.status(200).send({ success: "false", message: "No price specified" })
    }

    let eventToken = null;
    const aid = guid();
    let ticket = "/event/u/ticket/" + aid;
    let link = "/event/u/arena/" + aid;
    if(price?.withChips === 'with'){
      eventToken = await Token.findOne({ where: { used: false }});
    }

    if(price?.amount > 0){
      const form = _.pick(req.body,['amount','email','name']);
      form.metadata = {
          full_name : form?.name,
          image: req?.body?.image,
          phone: req?.body?.phone,
          event_price_id: req?.body?.event_prices_id,
          price_category: price?.title,
          event_id: req?.body?.event_id
      }
      form.amount = price?.amount * 100;
      form.full_name = form?.name;
      const paystack = await initializePayment(form);

      if(!paystack){
        return res.status(200).send({ success: "false", message: "Unable to make payment" })
      }

      await Paystack.create({
        id: guid(),
        access_code: paystack?.access_code,
        authorization_url: paystack?.authorization_url,
        reference: paystack?.reference,
        metadata: JSON.stringify(form)
      });

      return res.status(200).send({ success: "true", link: paystack?.authorization_url })
    }

    attendee = await Attendee.create({
      id: aid,
      event_id: req?.body?.event_id,
      event_price_id: req?.body?.event_prices_id,
      image: req?.body?.image,
      name: req?.body?.name,
      email: req?.body?.email,
      phone: req?.body?.phone,
      price_category: price?.title,
      ticket: ticket,
      link: link,
      token: eventToken?.token
    });

    //update token only after a link is generated
    if(eventToken?.token){
      await Token.update({ used: true }, {
        where: {
          token: eventToken?.token
        }
      });
    }

    //send an email with the user link attached
    return res.status(200).send({ success: "true", link: ticket, message: 'You have been successfully registered' });
  } catch (error) {
    logger(error);
    return res.status(500).send({ success: "false", message: "An error occurred" });
  }
};

const cardPaymentSuccess = async (req, res) => {
  try {
    const vpay = await verifyPayment(req?.body?.reference);
    if(!vpay){
      return res.status(200).send({ success: "false", message: "Invalid transaction" });
    }

    const metadata = vpay?.data?.metadata;

    let attendee = await Attendee.findOne({ where: { 
      email: vpay?.data?.customer?.email,
      event_id:  metadata?.event_id
    }});
    if(attendee){
      return res.status(200).send({ success: "true", link: attendee?.ticket, message: "You are already registered" })
    }

    const price = await Price.findOne({ where: { id: metadata?.event_price_id }});
    if(!price) {
      return res.status(200).send({ success: "false", message: "No price specified" })
    }

    let eventToken = null;
    const aid = guid();
    let ticket = "/event/u/ticket/" + aid;
    let link = "/event/u/arena/" + aid;
    
    if(price?.withChips === 'with'){
      eventToken = await Token.findOne({ where: { used: false }});
    }

    attendee = await Attendee.create({
      id: aid,
      event_id: metadata?.event_id,
      event_price_id: metadata?.event_price_id,
      image: metadata?.image,
      name: metadata?.full_name,
      email: metadata?.email,
      phone: metadata?.phone,
      price_category: price?.title,
      ticket: ticket,
      link: link,
      token: eventToken?.token
    });

    //update token only after a link is generated
    if(eventToken?.token){
      await Token.update({ used: true }, {
        where: {
          token: eventToken?.token
        }
      });
    }

    //send an email with the user link attached
    res.status(200).send({ success: "true", link: ticket, message: 'You have been successfully registered' });
  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: "A server error occurrred" })
  }
}

const cardTokenPage = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  try {

    let token = {}
    const attendee = await Attendee.findOne({
      where: { id: req.params.id }
    });
    token = { ...attendee.dataValues }

    const event = await Event.findOne({
      where: { id: attendee.event_id }
    });
    token.event = event;

    const price = await Price.findOne({
      where: { id: attendee.event_price_id }
    })
    token.price = price;

    res.status(200).send({ success: 'true', data: token })
  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: "An error occurred" });
  }
};

const cardChipLoader = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get Event by id'
     #swagger.security = [{
               "apikey": []
        }]
  */

  try {
    let obj = {};
    const url = await EventUrl.findOne({
      where: { event_id: req.params.id }
    });
    obj = { ...url?.dataValues }

    const tokens = await Token.findAll();
    obj.tokens = tokens

    if(obj?.event_attendee_id){
      const attendee = await Attendee.findOne({
        where: { id: obj.event_attendee_id }
      });
      obj.attendee = attendee;

      const event = await Event.findOne({
        where: { id: attendee.event_id }
      });
      obj.event = event;
  
      const price = await Price.findOne({
        where: { id: attendee.event_price_id }
      })
      obj.price = price;
    }

    res.status(200).send({ success: 'true', data: obj })
  } catch (error) {
    logger(error);
    res.status(500).send({ success: "false", message: "An error occurred" });
  }
};

const attachTokenToChip = async (req, res) => {
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
  cardGetEvents,
  cardSearchEvents,
  cardGetEvent,
  cardRegisterEvent,
  cardTokenPage,
  cardChipLoader,
  attachTokenToChip,
  cardPaymentSuccess,
  cardGetOpenEvents
};
