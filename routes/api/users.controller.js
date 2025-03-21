var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../../models/users");
const { getEnv } = require("../../helpers/dotenv.helper");

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 */
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

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login body", req.body);
  try {
    const account = await Login.findOne({ username });
    if (!account) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: account._id }, getEnv("SECRET_KEY"), {
      expiresIn: getEnv("JWT_EXPIRES_IN"),
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({ error });
  }
});

module.exports = router;
