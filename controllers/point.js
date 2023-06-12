const { Op } = require("sequelize");
const Sale = require("../models").Sale;
const Point = require("../models/").Point;
const MenuItem = require("../models").MenuItem;
const FeedBack = require("../models").FeedBack;

const create = async (req, res) => {
  try {
    const { role } = req.user;
    const {
      email,
      password,
      ownerId,
      addressHy,
      addressRu,
      addressEn,
      lat,
      lng,
      phone,
    } = req.body;

    if (role == "admin" || role == "owner") {
      await Point.create({
        email,
        password,
        role: "point",
        active: false,
        addressHy,
        addressRu,
        addressEn,
        ownerId,
        phone,
        lat,
        lng,
      });
      return res.json({ succes: true });
    }
    return res.json({
      succes: false,
      msg: "Cant creacte point, dont have access",
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const deletePoint = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.body;

    if (role == "admin" || role == "owner") {
      const point = await Point.findOne({
        where: { id },
      });
      point.destroy();
      return res.json({ succes: true });
    }
    return res.json({
      succes: false,
      msg: "Cant creacte point, dont hav access",
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const pointActivity = async (req, res) => {
  try {
    const { role } = req.user;
    const { id, active } = req.body;

    if (role == "admin" || role == "owner") {
    const point = await Point.findOne({
      where: { id },
    });
    point.active = active;
    await point.save();
    return res.json({ succes: true });
    }
    return res.json({
      succes: false,
      msg: "Cant creacte point, dont hav access",
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const offset = Number.parseInt(req.query.page) - 1 || 0;
    const limit = Number.parseInt(req.query.size) || 16;
    const ownerId = Number.parseInt(req.query.ownerId);
    const sort = req.query.sort;
    let queryObj = {};
    let sortedItems = [];
    if (search) {
      let searchedItems = JSON.parse(search);

      if (searchedItems.phone)
        queryObj.phone = { [Op.like]: `%${searchedItems.phone}%` };
    }
    if (ownerId) {
      queryObj.ownerId = { [Op.eq]: ownerId };
    }
    if (sort !== undefined) {
      sortedItems.push([sort.split(",")[0], sort.split(",")[1].toUpperCase()]);
    }
    const count = await Point.findAll({
      where: {
        ...queryObj,
      },
      order: sortedItems,
    });
    const allItems = await Point.findAll({
      where: {
        ...queryObj,
      },
      order: [...sortedItems],
      offset: offset * limit,
      limit,
      include: [
        {
          model: MenuItem,
          as: "menuItems",
          include: [
            { model: Sale, as: "sales" },
            { model: FeedBack, as: "feedBacks" },
          ],
        },
      ],
    });
    let totalPages = Math.ceil(count.length / limit);
    return res.json({
      data: allItems,
      totalElements: count.length,
      totalPages,
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const getSingle = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    if (role == "admin") {
      const point = await Point.findOne({
        where: { id },
        include: [
          {
            model: MenuItem,
            as: "menuItems",
            include: [
              { model: Sale, as: "sales" },
              { model: FeedBack, as: "feedBacks" },
            ],
          },
        ],
      });
      return res.json({
        succes: true,
        data: point,
      });
    }
    return res.json({
      succes: false,
      msg: "Cant creacte point, dont hav access",
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = { create, deletePoint, pointActivity, getAll, getSingle };
