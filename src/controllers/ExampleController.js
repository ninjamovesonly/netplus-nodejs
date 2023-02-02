"use strict";

const views = require("../views");

const helloWorld = async (req, res) => {
  return res.render(views.home);
};

const docsCheckout = async (req, res) => {
  return res.render(views.docs.checkout);
}

const docsInvincible = async (req, res) => {
  return res.render(views.docs.invincible);
};

module.exports = {
  helloWorld,
  docsInvincible,
  docsCheckout
};
