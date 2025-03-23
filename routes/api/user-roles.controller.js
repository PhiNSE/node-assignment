const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userRolesModel = require("../../models/user-roles");
const userModel = require("../../models/users");

router.get("/", async (req, res, next) => {
  try {
    const userRoles = await userRolesModel.find();
    res.json(userRoles);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const userRole = new userRolesModel(req.body);
    await userRolesModel.create(userRole);
    res.json(userRole);
  } catch (err) {
    res.status(400).json(err);
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
