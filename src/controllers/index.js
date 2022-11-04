"use strict";

const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getRequestedCards,
  searchEvents,
  getEvent,
} = require("./event");

const {
  cardGetEvents,
  cardGetOpenEvents,
  cardSearchEvents,
  cardGetEvent,
  cardRegisterEvent,
  cardPaymentSuccess,
  cardTokenPage,
  cardChipLoader,
  attachTokenToChip,
  setCheckedStatus
} = require("./card");

const { createPrice, updatePrice, getPrices, getPrice } = require("./price");

const {
  createGallery,
  updateGallery,
  deleteGallery,
  getGalleries,
  getGallery,
} = require("./gallery");

const {
  createAttendee,
  updateAttendee,
  getAttendees,
  getAttendee,
} = require("./attendee");

const {
  saveArenaChat,
  getArenaChat
} = require('./arena');

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getRequestedCards,
  searchEvents,
  getEvent,
  createPrice,
  updatePrice,
  getPrices,
  getPrice,
  createGallery,
  updateGallery,
  deleteGallery,
  getGalleries,
  getGallery,
  createAttendee,
  updateAttendee,
  getAttendees,
  getAttendee,
  cardGetEvents,
  cardGetOpenEvents,
  cardSearchEvents,
  cardGetEvent,
  cardRegisterEvent,
  cardPaymentSuccess,
  cardTokenPage,
  cardChipLoader,
  attachTokenToChip,
  saveArenaChat,
  getArenaChat,
  setCheckedStatus
};
