
const logger = require("../util/log");
const { Attendee, EventChat } = require("../models");

const getAttendees = async (id) => {
    /*
        #swagger.tags = ["Attendee"]
        #swagger.description = 'Get Attendees by event_id'
        #swagger.security = [{
                    "apikey": []
            }]
    */

    try {
        const data = await Attendee.findAll({ where: { event_id: id } });
        return data;
    } catch (error) {
        logger(error);
        return [];
    }
};

const getChats = async (id) => {
    /*
        #swagger.tags = ["Attendee"]
        #swagger.description = 'Get Attendees by event_id'
        #swagger.security = [{
                    "apikey": []
            }]
    */

    try {
        const data = await EventChat.findAll({ where: { event_id: id } });
        return data;
    } catch (error) {
        logger(error);
        return [];
    }
};

module.exports = {
    getAttendees,
    getChats
}