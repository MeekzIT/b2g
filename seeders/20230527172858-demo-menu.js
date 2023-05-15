"use strict";
const data = require("../mock/menu");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("MenuItems", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("MenuItems", null, {});
  },
};
