const Users = require("../models").User;
const Verify = require("../models").VerifyCode;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!(firstName && lastName && phone && email && password)) {
      return res.json({
        error: ["fiels error"],
      });
    }

    const oldUser = await Users.findOne({
      where: { email: email.toLowerCase() },
    });

    if (oldUser) {
      return res.json({
        error: ["Invalid credentials", "You alredy have account"],
      });
    }
    if (!oldUser) {
      let encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = await Users.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        block: false,
        password: encryptedPassword,
      });
      const token = jwt.sign(
        { user_id: newUser.id, email },
        process.env.TOKEN_KEY
      );
      newUser.token = token;
      await newUser.save();
      return res.json({ succes: true, token });
    }

    return res.json({ error: ["Invalid credentials"] });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.json({
        error: ["Password and email are required fields"],
      });
    }

    const user = await Users.findOne({
      where: { email: email.toLowerCase() },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user.id, email },
        process.env.TOKEN_KEY
      );
      user.token = token;
      user.save();
      return res.json({
        succes: true,
        data: { token: user.token },
        user,
      });
    }
    return res.json({ error: ["Invalid credentials"] });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const logout = async (req, res) => {
  try {
    const { user_id } = req.user;

    const user = await Users.findOne({ where: { id: user_id } });
    user.token = null;
    await user.save();
    return res.json({ succes: true });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const getMe = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await Users.findOne({ where: { id: user_id } });
    return res.json(user);
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const conformPasswordAddCode = async (req, res) => {
  const { email } = req.body;

  const thisUSer = await User.findOne({
    where: { email: email.toLowerCase() },
  });

  if (!thisUSer) {
    return res.json({
      error: ["User Not Found!"],
    });
  }

  try {
    let generateCode = JSON.parse(
      JSON.stringify(new String(generateString(8)))
    );

    await Verify.create({
      code: generateCode,
      email: email.toLowerCase(),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: email,
        text: generateCode,
      },
      function (error, info) {
        if (error) {
          console.log(error, "🚀");
        } else {
          console.log("🚀  info.response", "Email sent: " + info.response);
        }
      }
    );
    return res.json({ message: "Verify code sent in you email" });
  } catch (error) {
    return res.json({
      error: ["Something Is Wrong!"],
    });
  }
};

const checkVerifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const oldcode = await Verify.findOne({
      where: {
        code: newCode,
        email: email.toLowerCase(),
      },
    });
    if (oldcode.code == code) {
      await oldcode.destroy();
      return res.json({ succes: true });
    } else return res.json({ succes: false });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const newPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email: email.toLowerCase() } });
    if (user) {
      let encryptedPassword = await bcrypt.hash(password, 10);
      user.password = encryptedPassword;
      await user.save();
      return res.json({ succes: true });
    }
    return res.json({ succes: false });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const edit = async (req, res) => {
  try {
    const data = req.body;

    let user = await Users.findOne({ where: { id: data.id } });
    await user.update(data);
    await user.save();
    return res.json({ succes: true });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

// =-------------------- admin ---------------------

const getAll = async (req, res) => {
  const { search } = req.query;
  const offset = Number.parseInt(req.query.page) - 1 || 0;
  const limit = Number.parseInt(req.query.size) || 16;
  const count = await Users.findAll();
  let queryObj = {};
  if (search) {
    let searchedItems = JSON.parse(search);

    if (searchedItems.phone)
      queryObj.phone = { [Op.like]: `%${searchedItems.phone}%` };
  }
  try {
    const allUsers = await Users.findAll({
      where: {
        ...queryObj,
      },
      offset: offset * limit,
      limit,
    });
    let totalPages = Math.ceil(count.length / limit);
    return res.json({
      data: allUsers,
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
    if (id) {
      const user = await Users.findOne({
        where: { id },
      });
      return res.json(user);
    } else return res.json(true);
  } catch (e) {
    console.log("something went wrong", e);
  }
};

const blockUser = async (req, res) => {
  try {
    const { id, block } = req.body;
    const user = await Users.findOne({
      where: { id },
    });
    user.block = block;
    return res.json({ succes: true });
  } catch (e) {
    console.log("something went wrong", e);
  }
};

module.exports = {
  login,
  logout,
  getMe,
  register,
  edit,
  conformPasswordAddCode,
  checkVerifyCode,
  newPassword,
  getAll,
  getSingle,
  blockUser,
};
