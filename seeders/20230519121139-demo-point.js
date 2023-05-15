"use strict";
const data = require("../mock/point");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Points", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Points", null, {});
  },
};
