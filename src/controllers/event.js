"use strict";

const { Op } = require("sequelize");
const { Event, Price, Gallery } = require("../models");
const { asyncForEach } = require("../util");
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

const getPrices = async (id) => {
  return await Price.findAll({ where: { event_id: id } })
    .then((data) => {
      data = data.length ? data : [];
      return data;
    })
    .catch((err) => logger(err));
};

const getGallery = async (id) => {
  return await Gallery.findAll({ where: { event_id: id } })
    .then((data) => {
      data = data.length ? data : [];
      return data;
    })
    .catch((err) => logger(err));
};

const getPast = async () => {
  return new Promise(async (resolve) => {
    await Event.findAll({
      limit: 20,
      where: {
        start_date: {
          [Op.lt]: new Date(),
        },
      },
    }).then(async (data) => {
      let events = [];
      asyncForEach(data, async (item) => {
        await getPrices(item.id).then(async (prices) => {
          await getGallery(item.id).then((gallery) => {
            events.push({ ...item.dataValues, prices, gallery });
          });
        });
      }).finally(() => {
        resolve(events);
      });
    });
  });
};

const getFuture = async () => {
  return new Promise(async (resolve) => {
    await Event.findAll({
      limit: 20,
      where: {
        start_date: {
          [Op.gt]: new Date(),
        },
      },
    }).then(async (data) => {
      let events = [];
      await asyncForEach(data, async (item) => {
        await getPrices(item.id).then(async (prices) => {
          await getGallery(item.id).then((gallery) => {
            events.push({ ...item.dataValues, prices, gallery });
          });
        });
      }).finally(() => {
        resolve(events);
      });
    });
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
    const event = await Event.create({
      user_id: req.isce_auth.user_id,
      image: req.body.image,
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      gallery: "",
    });

    let response;
    if (event?.id) {
      const prices = req.body?.prices;
      if(prices?.length > 0){
        prices.forEach(async (price) => {
          await Price.create({ event_id: event.id, ...price, order_amount: 0 })
        });
      }

      const gallery = req.body?.gallery;
      if (gallery?.length > 0){
        gallery.forEach(async (item) => {
          await Gallery.create({ event_id: event.id, ...item });
        });
      }

      response = {
        success: "true",
        message: "Event created successfully",
        data: event,
      };
    } else {
      response = { success: "false", message: "Unable to save event" };
    }
    res.send(response);
  } catch (error) {
    logger(error);
    res.send({ success: "false", message: error.message });
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
    .catch((err) => {
      logger(err);
      res.send({ success: "false", message: error.message });
    });
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
    .catch((err) => {
      logger(err);
      res.send({ success: "false", message: error.message });
    });
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
          user_id: {
            [Op.eq]: req.isce_auth?.user_id
          }
        },
      }).then(async (data) => {
        let past, upcoming;

        await getPast().then((pe) => {
          past = pe;
        });

        await getFuture().then((fe) => {
          upcoming = fe;
        });
        let events = [];
        await asyncForEach(data, async (item) => {
          await getPrices(item.id).then(async (prices) => {
            prices = prices.length ? prices : [];
            await getGallery(item.id).then((gallery) => {
              events.push({ ...item.dataValues, prices, gallery });
            });
          });
        }).finally(() => {
          res.send({
            success: "true",
            data: {
              count: data.length,
              all: events,
              past,
              upcoming,
              total,
            },
          });
        });
      });
    })
    .catch((err) => {
      logger(err);
      res.send({
        success: "false",
        message: err.message,
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
      }).then(async (data) => {
        let events = [];
        await asyncForEach(data, async (item) => {
          await getPrices(item.id).then((prices) => {
            events.push({ ...item, prices });
          });
        }).finally(() => {
          res.send({
            success: "true",
            data: {
              count: data.length,
              all: data,
              total,
            },
          });
        });
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
    .then(async (data) => {
      if (data.id) {
        await getPrices(data.id).then(async (prices) => {
          await getGallery(data.id).then((gallery) => {
            data = { ...data.dataValues, gallery, prices };
            res.send({ success: true, data });
          });
        });
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
