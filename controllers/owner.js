const Owner = require("../models").Owner;
const Point = require("../models").Point;
const MenuItem = require("../models").MenuItem;

const create = async (req, res) => {
  try {
    const { role } = req.user;
    const { email, password, phone } = req.body;

    if (role == "admin") {
      await Owner.create({
        email,
        password,
        role: "owner",
        active: false,
        phone,
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

const deleteOwner = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.body;

    if (role == "admin") {
      const owner = await Owner.findOne({
        where: { id },
      });
      owner.destroy();
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

const ownerActivity = async (req, res) => {
  try {
    const { role } = req.user;
    const { id, active } = req.body;

    if (role == "admin") {
      const owner = await Owner.findOne({
        where: { id },
      });
      owner.active = active;
      await owner.save();
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
    const offset = Number.parseInt(req.query.page) - 1 || 0;
    const limit = Number.parseInt(req.query.size) || 16;
    const sort = req.query.sort;
    let queryObj = {};
    let sortedItems = [];
    if (search) {
      let searchedItems = JSON.parse(search);

      if (searchedItems.phone)
        queryObj.phone = { [Op.like]: `%${searchedItems.phone}%` };
    }
    if (sort !== undefined) {
      sortedItems.push([sort.split(",")[0], sort.split(",")[1].toUpperCase()]);
    }
    const count = await Owner.findAll({
      where: {
        ...queryObj,
      },
      order: [...sortedItems],
    });
    const allItems = await Owner.findAll({
      where: {
        ...queryObj,
      },
      offset: offset * limit,
      limit,
      include: [
        {
          model: Point,
          as: "points",
          include: [
            {
              model: MenuItem,
              as: "menuItems",
            },
          ],
        },
      ],
      order: [...sortedItems],
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

    if (role == "admin" || role == "owner") {
      const owner = await Owner.findOne({
        where: { id },
        include: [
          {
            model: Point,
            as: "points",
            include: [
              {
                model: MenuItem,
                as: "menuItems",
              },
            ],
          },
        ],
      });
      return res.json({
        succes: true,
        data: owner,
      });
    }
    return res.json({
      succes: false,
      msg: "Cant creacte owner, dont have access",
    });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = { create, deleteOwner, ownerActivity, getAll, getSingle };
