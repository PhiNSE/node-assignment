const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const categoryModel = require("../../models/categories");
const {
  adminRoleMiddleware,
} = require("../../middleware/admin.role.middleware");

router.get("/", async (req, res, next) => {
  try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", adminRoleMiddleware, async (req, res, next) => {
  try {
    const category = new categoryModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", adminRoleMiddleware, async (req, res, next) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", adminRoleMiddleware, async (req, res, next) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
