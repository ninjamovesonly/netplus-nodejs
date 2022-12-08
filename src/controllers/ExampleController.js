"use strict";

const views = require("../views");

const helloWorld = async (req, res) => {
  res.render(views.home);
};

module.exports = {
  helloWorld
};
