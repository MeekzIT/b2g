const Admin = require("../models").Admin;
const Users = require("../models").User;
const Owner = require("../models").Owner;
const Point = require("../models").Point;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.json({
        error: ["Password and email are required fields"],
      });
    }

    const admin = await Admin.findOne({
      where: { email: email.toLowerCase() },
    });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign(
        { user_id: admin.id, email, role: admin.role },
        process.env.TOKEN_KEY_ADMIN
      );
      admin.token = token;
      admin.save();
      return res.json({
        succes: true,
        data: { token: admin.token, role: admin.role },
      });
    }

    const owner = await Owner.findOne({
      where: { email: email.toLowerCase() },
    });

    if (owner && (await bcrypt.compare(password, owner.password))) {
      const token = jwt.sign(
        { user_id: owner.id, email, role: owner.role },
        process.env.TOKEN_KEY_ADMIN
      );
      owner.token = token;
      owner.save();
      return res.json({
        succes: true,
        data: { token: owner.token, role: owner.role },
      });
    }

    const point = await Point.findOne({
      where: { email: email.toLowerCase() },
    });

    if (point && (await bcrypt.compare(password, point.password))) {
      const token = jwt.sign(
        { user_id: point.id, email, role: point.role },
        process.env.TOKEN_KEY_ADMIN
      );
      point.token = token;
      point.save();
      return res.json({
        succes: true,
        data: { token: point.token, role: point.role },
      });
    }
    return res.json({ error: ["Invalid credentials"] });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const logout = async (req, res) => {
  try {
    const { user_id, role } = req.user;

    if (role == "admin") {
      const user = await Admin.findOne({ where: { id: 1 } });
      user.token = null;
      await user.save();
      return res.json({ succes: true });
    } else if (role == "owner") {
      const user = await Owner.findOne({ where: { id: user_id } });
      user.token = null;
      await user.save();
      return res.json({ succes: true });
    } else if (role == "point") {
      const user = await Point.findOne({ where: { id: user_id } });
      user.token = null;
      await user.save();
      return res.json({ succes: true });
    }
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const changeSettings = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    const { email, password } = req.body;
    let encryptedPassword = await bcrypt.hash(password, 10);
    if (role == "admin") {
      const user = await Admin.findOne({ where: { id: 1 } });
      user.email = email;
      user.password = encryptedPassword;
      await user.save();
      return res.json({ succes: true });
    } else if (role == "owner") {
      const user = await Owner.findOne({ where: { id: user_id } });
      const { phone } = req.body;
      user.email = email;
      user.password = password;
      user.phone = phone;
      await user.save();
      return res.json({ succes: true });
    } else if (role == "point") {
      const { address, lat, lng, phone } = req.body;
      const user = await Users.findOne({ where: { id: user_id } });
      user.email = email;
      user.password = password;
      user.address = address;
      user.lat = lat;
      user.lng = lng;
      user.phone = phone;
      await user.save();
      return res.json({ succes: true });
    }
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const getMe = async (req, res) => {
  try {
    const { role, user_id } = req.user;
    if (role == "admin") {
      const user = await Admin.findOne({
        where: { id: 1 },
      });
      return res.json({ data: user, succes: true });
    } else if (role == "owner") {
      const user = await Owner.findOne({
        where: { id: user_id },
      });
      return res.json({ data: user, succes: true });
    } else if (role == "point") {
      const user = await Point.findOne({
        where: { id: user_id },
      });
      return res.json({ data: user, succes: true });
    }
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = {
  login,
  logout,
  changeSettings,
  getMe,
};
