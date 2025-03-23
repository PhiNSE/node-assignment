const express = require("express");
const router = express.Router();
const Product = require("../../models/products");
const Category = require("../../models/categories");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    const products = await Product.find().populate("category");
    res.render("products", { products, categories });
  } catch (error) {
    console.error("Error fetching products: ", error);
    res.status(500).send("Error fetching products.");
  }
});
router.post("/create", async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, price, category } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
    });
    await newProduct.save();
    res.redirect("/products");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Error creating product.");
  }
});
router.post("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    await Product.findByIdAndUpdate(id, req.body);

    res.redirect("/products");
  } catch (error) {
    console.error("Error updating product: ", error);
    res.status(500).send("Error updating product.");
  }
});
router.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  } catch (error) {
    console.error("Error deleting product: ", error);
    res.status(500).send("Error deleting product.");
  }
});

module.exports = router;
