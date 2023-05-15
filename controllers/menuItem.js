const { Op } = require("sequelize");
const MenuItem = require("../models").MenuItem;

const create = async (req, res) => {
  try {
    const { role } = req.user;
    const {
      image,
      nameHy,
      nameRu,
      nameEn,
      descHy,
      descRu,
      descEn,
      price,
      rating,
      pointId,
      ownerId,
    } = req.body;

    if (role == "admin" || role == "owner" || role == "point") {
      await MenuItem.create({
        image,
        nameHy,
        nameRu,
        nameEn,
        descHy,
        descRu,
        descEn,
        price,
        rating,
        pointId,
        ownerId,
      });
      return res.json({ succes: true });
    }
    return res.json({
      succes: false,
      msg: "Cant creacte owner, dont have access",
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const edit = async (req, res) => {
  try {
    const { role } = req.user;
    const {
      id,
      image,
      nameHy,
      nameRu,
      nameEn,
      descHy,
      descRu,
      descEn,
      price,
      rating,
      pointId,
      ownerId,
    } = req.body;

    if (role == "admin" || role == "owner" || role == "point") {
      let menuItem = await MenuItem.findOne({ where: { id } });
      menuItem.image = image;
      menuItem.nameHy = nameHy;
      menuItem.nameRu = nameRu;
      menuItem.nameEn = nameEn;
      menuItem.descHy = descHy;
      menuItem.descRu = descRu;
      menuItem.descEn = descEn;
      menuItem.price = price;
      menuItem.rating = rating;
      menuItem.pointId = pointId;
      menuItem.ownerId = ownerId;
      await menuItem.save();
      return res.json({ succes: true });
    }
    return res.json({
      succes: false,
      msg: "Cant creacte owner, dont have access",
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const del = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.body;
    if (role == "admin" || role == "owner" || role == "point") {
      let menuItem = await MenuItem.findOne({ where: { id } });
      await menuItem.destroy();
      return res.json({ succes: true });
    }
    return res.json({
      succes: false,
      msg: "Cant creacte owner, dont have access",
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const getAll = async (req, res) => {
  try {
    const { search } = req.query;
    const offset = Number.parseInt(req.query.page) || 0;
    const limit = Number.parseInt(req.query.size) || 16;

    let queryObj = {};
    if (search) {
      let searchedItems = JSON.parse(search);

      if (searchedItems.priceMin) {
        queryObj.priceMin = { [Op.gte]: `%${Number(searchedItems.priceMin)}%` };
      }
      if (searchedItems.priceMax) {
        queryObj.priceMax = { [Op.lte]: `%${Number(searchedItems.priceMax)}%` };
      }
      if (searchedItems.pointId) {
        queryObj.pointId = { [Op.eq]: searchedItems.pointId };
      }
      if (searchedItems.ownerId) {
        queryObj.ownerId = { [Op.eq]: searchedItems.ownerId };
      }
    }
    const count = await MenuItem.findAll({
      where: {
        ...queryObj,
      },
    });

    const allItems = await MenuItem.findAll({
      where: {
        ...queryObj,
      },
      offset: offset * limit,
      limit,
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
    const { id } = req.params;

    const point = await MenuItem.findOne({
      where: { id },
    });
    return res.json({
      succes: true,
      data: point,
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = { create, edit, del, getAll, getSingle };
