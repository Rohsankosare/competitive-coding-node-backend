const express = require("express");
const bcrypt = require("bcrypt");
const authRoutes = express.Router();
const userAuthModel = require("../database/Models/userAuthModel");
const generateJSONToken = require("./token");
const authenticateUser = require("./authenticationToken");
const userProfileModel = require("../database/Models/userProfileModel");

// create new user route
authRoutes.post("/createuser", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const hPassword = await bcrypt.hash(password, 10);
    const user = await userAuthModel.findOne({ email: email });

    if (user)
      return res.json({
        success: false,
        errors: { email: { message: "This email is already registered" } },
      });

    const userProfile = new userProfileModel({
      email: email,
      username: username,
    });
    userAuthModel
      .create({
        username: username,
        password: hPassword,
        email: email,
        userProfileDocId: userProfile["_id"],
      })
      .then(async (user) => {
        await userProfile.save();

        const token = generateJSONToken({
          userObjectId: user["userProfileDocId"],
        });
        return res
          .cookie("access_token", token, { httpOnly: true })
          .json({ success: true, message: "loged in " });
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (err) {
    res.send(err);
  }
});

//log in routes
authRoutes.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userAuthModel.findOne({ email: email });

    if (!user)
      return res.json({
        errors: {
          email: { message: "invalid email " },
        },
      });

    const isLegitUser = await bcrypt.compare(password, user.password);

    if (!isLegitUser)
      return res.json({
        errors: { password: { message: "incorrect password" } },
      });

    const token = generateJSONToken({
      userObjectId: user["userProfileDocId"],
    });

    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({ success: true, message: "loged in " });
  } catch (err) {
    res.send(err);
  }
});

//log out route

authRoutes.get("/logout", authenticateUser, (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ success: true, message: "loged out" });
});

//check if user is authorized

authRoutes.get("/isauthorized", authenticateUser, (req, res) => {
  res.send(true);
});

module.exports = authRoutes;
