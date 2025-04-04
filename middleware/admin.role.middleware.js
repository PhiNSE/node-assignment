const jwt = require("jsonwebtoken");
const { getEnv } = require("../helpers/dotenv.helper");
const secretKey = getEnv("SECRET_KEY");

const userRolesConstant = require("../constant/user-roles.constant");

const adminRoleMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Authorization header:", req.header("Authorization"));
  console.log("Token nhận được từ header:", token);

  if (!token) {
    console.log("No token provided");
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    console.log("Token hợp lệ, user:", req.user);
    if (req.user.role !== userRolesConstant.admin) {
      return res
        .status(403)
        .json({ message: "Access denied, admin role required" });
    }
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(400).json({ message: "Invalid token" });
  }
};

module.exports.adminRoleMiddleware = adminRoleMiddleware;
