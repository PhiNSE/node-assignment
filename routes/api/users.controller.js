var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../../models/users");
const { getEnv } = require("../../helpers/dotenv.helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRolesConstant = require("../../constant/user-roles.constant");
const { getRoleId } = require("../../helpers/get-role-id.helper");
const emailRegexConstant = require("../../constant/email-regex.constant");
const userRolesModel = require("../../models/user-roles");

const register = async (req, res, roleName) => {
  const { username, email, password, confirmpassword } = req.body;

  if (!username || !email || !password || !confirmpassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (emailRegexConstant.test(email) === false) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  } else {
    try {
      const existingAccount = await userModel.findOne({ username });
      if (existingAccount) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await userModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      //get role id
      const roleId = await getRoleId(roleName);

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAccount = new userModel({
        username,
        email,
        password: hashedPassword,
        role: roleId,
      });
      await newAccount.save();
      res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};

router.post("/register", async (req, res) => {
  register(req, res, userRolesConstant.user);
});

router.post("/register-admin", async (req, res) => {
  register(req, res, userRolesConstant.admin);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login body", req.body);
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const role = await userRolesModel.findById(user.role);

    const accessToken = jwt.sign(
      { id: user._id, role: role.roleName },
      getEnv("SECRET_KEY"),
      {
        expiresIn: getEnv("JWT_EXPIRES_IN"),
      }
    );
    res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ error });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const users = await userModel.find().populate("role");
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
