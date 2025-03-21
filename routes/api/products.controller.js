const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const productModel = require("../../models/products");

router.get("/", async (req, res, next) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const product = new productModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
