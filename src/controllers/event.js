"use strict";

const { response } = require("express");
const { Op } = require("sequelize");
const { Event, Price } = require("../models");
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

const getPast = async () => {
  return await Event.findAll({
    limit: 20,
    where: {
      start_date: {
        [Op.lt]: new Date(),
      },
    },
  }).then((data) => {
    return data;
  });
};

const getFuture = async () => {
  return await Event.findAll({
    limit: 20,
    where: {
      start_date: {
        [Op.gt]: new Date(),
      },
    },
  }).then((data) => {
    return data;
  });
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
                      $image: "string",
                      $location: "string",
                      $user_id: "string",
                      $start_date: "datetime",  
                      $end_date: "datetime",  
                }
        }
  */

  try {
    const data = await Event.create({
      user_id: req.isce_auth.user_id,
      image: req.body.image,
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: "2022-10-10"
    });

    let response;
    if(data.id){
      response = { success: 'true', message: 'Event created successfully', data };
    }else{
      response = { success: 'false', message: 'Unable to save event' };
    }
    res.send(response);
  } catch (error) {
    logger(error);
    res.send({ success: 'false', message: error.message });
  }
};

const updateEvent = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Update Event'
     #swagger.security = [{
               "apikey": []
        }]
     #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                      $title: "string",
                      $description: "string",
                      $image: "string",
                      $location: "string",
                      $start_date: "datetime",  
                      $end_date: "datetime",  
                }
        }
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
      await Event.findAll({
        limit,
        offset,
        where: {
          start_date: {
            [Op.gte]: new Date(),
          },
        },
      }).then(async (data) => {
        let past, upcoming;

        await getPast().then((pe) => {
          past = pe;
        });

        await getFuture().then((fe) => {
          upcoming = fe;
        });

        res.send({
          success: 'true',
          data: {
            count: data.length,
            all: data,
            past,
            upcoming
          }
        });
      });
    })
    .catch((err) => {
      logger(err);
      res.send({
        success: 'false',
        message: 'Unable to get events list'
      });
    });
};

const getPastEvents = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Get past events'
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
      await Event.findAll({
        limit,
        offset,
        where: {
          start_date: {
            [Op.lt]: new Date(),
          },
        },
      }).then((data) => {
        res.send({ success: true, data, total });
      });
    })
    .catch((err) => logger(err));
};

const searchEvents = async (req, res) => {
  /*
    #swagger.tags = ["Event"]
    #swagger.description = 'Search events using title or description'
     #swagger.security = [{
               "apikey": []
        }]
  */
  let offset = 0,
    page = Number(req.query.page) || 1,
    limit = Number(req.query.limit) || 100,
    query = req.query.query;

  if (page > 1) {
    offset = limit * page;
    offset = offset - limit;
  }

  await totalCount()
    .then(async (total) => {
      await Event.findAll({
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
      }).then((data) => {
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
  getPastEvents,
  searchEvents,
  getEvent,
};
