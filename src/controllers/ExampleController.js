"use strict";

const views = require("../views");

const helloWorld = async (req, res) => {
  res.render(views.home);
};

const docsInvincible = async (req, res) => {
  res.render(views.docs.invincible);
};

module.exports = {
  helloWorld,
  docsInvincible
};
