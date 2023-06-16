const { Op } = require("sequelize");
const MenuItem = require("../models").MenuItem;
const Sale = require("../models").Sale;
const FeedBack = require("../models").FeedBack;

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
        activity:true
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
    const data = req.body;

    if (role == "admin" || role == "owner" || role == "point") {
      let menuItem = await MenuItem.findOne({ where: { id:data.id } });
      await menuItem.update(data);
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
    const offset = Number.parseInt(req.query.page)- 1 || 0;
    const limit = Number.parseInt(req.query.size) || 16;
    const sort = req.query.sort;
    let queryObj = {};
    let sortedItems = [];
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
     if (sort !== undefined) {
       sortedItems.push([sort.split(",")[0], sort.split(",")[1].toUpperCase()]);
     }
    const count = await MenuItem.findAll({
      order: [...sortedItems],
      where: {
        ...queryObj,
      },
    });
    const allItems = await MenuItem.findAll({
      order: [...sortedItems],
      where: {
        ...queryObj,
      },
      offset: offset * limit,
      limit,
      include: [
        {
          model: Sale,
          as: "sales",
        },
        {
          model: FeedBack,
          as: "feedBacks",
        },
      ],
    });
    let totalPages = Math.ceil(count.length / limit);
    return res.json({
      offset,limit,
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
      include: [
        {
          model: Sale,
          as: "sales",
        },
        {
          model: FeedBack,
          as: "feedBacks",
        },
      ],
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
