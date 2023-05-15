"use strict";
const data = require("../mock/feedBacks");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("FeedBacks", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("FeedBacks", null, {});
  },
};
