const { Op } = require("sequelize");

const FeedBack = require("../models").FeedBack;

const create = async (req, res) => {
  try {
    const { name, text, menuItemId } = req.body;
    await FeedBack.create({ text, menuItemId, hide: false });

    return res.json({
      succes: true,
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const changeActivity = async (req, res) => {
  try {
    const { id, activity } = req.body;
    const feedBack = await FeedBack.findOne({
      where: { id },
    });
    feedBack.hide = activity;
    await feedBack.save();
    return res.json({
      succes: true,
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.body;
    const feedBack = await FeedBack.findOne({
      where: { id },
    });
    await feedBack.destroy();
    return res.json({
      succes: true,
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const getFeedBacksOfMenuItem = async (req, res) => {
  try {
    const { search } = req.query;
    const offset = Number.parseInt(req.query.page) || 0;
    const limit = Number.parseInt(req.query.size) || 16;
    const sort = req.query.sort;
    let queryObj = {};
    let sortedItems = [];
    if (search) {
      let searchedItems = JSON.parse(search);

      if (searchedItems.name)
        queryObj.name = { [Op.like]: `%${searchedItems.name}%` };

      if (searchedItems.ownerId)
        queryObj.ownerId = { [Op.eq]: searchedItems.ownerId };

      if (searchedItems.poinId)
        queryObj.poinId = { [Op.eq]: searchedItems.poinId };

      if (searchedItems.menuItemId)
        queryObj.menuItemId = { [Op.eq]: searchedItems.menuItemId };
    }
    if (sort !== undefined) {
      sortedItems.push([sort.split(",")[0], sort.split(",")[1].toUpperCase()]);
    }
    const count = await FeedBack.findAll({
      where: {
        ...queryObj,
      },
    });
    const feedBacks = await FeedBack.findAll({
      where: {
        ...queryObj,
      },
      offset: offset * limit,
      limit,
    });
    let totalPages = Math.ceil(count.length / limit);
    return res.json({
      succes: true,
      data: feedBacks,
      totalElements: count.length,
      totalPages,
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = {
  create,
  changeActivity,
  destroy,
  getFeedBacksOfMenuItem,
};
