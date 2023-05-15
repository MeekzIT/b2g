"use strict";
const data = require("../mock/sale");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Sales", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Sales", null, {});
  },
};
