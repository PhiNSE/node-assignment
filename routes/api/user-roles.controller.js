const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userRolesModel = require("../../models/user-roles");

router.get("/", async (req, res, next) => {
  try {
    const userRoles = await userRolesModel.find();
    res.json(userRoles);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/register", async (req, res) => {
  console.log("Register request received", req.body);
  const { username, email, password, confirmpassword } = req.body;

  if (password !== confirmpassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  } else {
    try {
      const existingAccount = await Login.findOne({ username });
      if (existingAccount) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await Login.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAccount = new Login({
        username,
        email,
        password: hashedPassword,
      });
      await newAccount.save();
      res.redirect("/admin/login");
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const userRole = await userRolesModel
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .populate("role");
    res.json(userRole);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const userRole = await userRolesModel.findByIdAndDelete(req.params.id);
    res.json(userRole);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
