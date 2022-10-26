const logger = require("../util/log");
const { Price } = require("../models");

const getPrices = async (id) => {
    try {
      const data = await Price.findAll({ where: { event_id: id } });
      return data;
    } catch (error) {
      logger(error);
      return [];
    }
};

module.exports = {
    getPrices
}