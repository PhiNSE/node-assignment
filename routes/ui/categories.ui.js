const express = require("express");
const router = express.Router();
const Category = require("../../models/categories");

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.render("categories", { categories: categories });
});
router.post("/create", async (req, res) => {
  const { name, description } = req.body;
  try {
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/create", (req, res) => {
  res.render("createCategory");
});
router.get("/editcategory", (req, res) => {
  res.render("editcategory");
});
router.post("/update/:id", async (req, res) => {
  const { name, description } = req.body;
  try {
    await Category.findByIdAndUpdate(req.params.id, { name, description });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/update/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.render("editCategory", { category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/delete/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
router.get("/delete/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
module.exports = router;
