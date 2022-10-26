const logger = require("../util/log");
const { Gallery } = require("../models");

const getGallery = async (id) => {
    try {
      const data = await Gallery.findAll({ where: { event_id: id } });
      return data;
    } catch (error) {
      logger(err);
      return [];
    }
};

module.exports = {
    getGallery
}