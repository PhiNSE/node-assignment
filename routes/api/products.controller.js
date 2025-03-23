const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  adminRoleMiddleware,
} = require("../../middleware/admin.role.middleware");

const productModel = require("../../models/products");

router.get("/", async (req, res, next) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", adminRoleMiddleware, async (req, res, next) => {
  try {
    const product = new productModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const fs = require("fs");
const multer = require("multer");
// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// API endpoint to upload an image and save the product
router.post(
  "/upload/:id",
  adminRoleMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      const imagePath = req.file.path;

      // Read the image file
      const imageBuffer = fs.readFileSync(imagePath);
      // Convert the image buffer to a base64 string
      const base64Image = imageBuffer.toString("base64");

      // Save the product to the database
      const product = await productModel.findById(id);
      product.image = base64Image;
      const newProduct = await product.save();

      // Delete the uploaded file after converting to base64
      fs.unlinkSync(imagePath);

      res
        .status(201)
        .json({ message: "Product saved successfully", product: newProduct });
    } catch (err) {
      console.error("Error saving product:", err);
      res
        .status(500)
        .json({ message: "Error saving product", error: err.message });
    }
  }
);

router.put("/:id", adminRoleMiddleware, async (req, res, next) => {
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

router.delete("/:id", adminRoleMiddleware, async (req, res, next) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
