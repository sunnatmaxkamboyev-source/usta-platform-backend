const express = require("express");

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// REGISTER
// ========================================

router.post(
  "/register",
  register
);

// ========================================
// LOGIN
// ========================================

router.post(
  "/login",
  login
);

// ========================================
// GET CURRENT USER
// ========================================

router.get(
  "/me",
  protect,
  getMe
);

// ========================================
// UPDATE PROFILE
// ========================================

router.put(
  "/profile",
  protect,
  updateProfile
);

// ========================================
// CHANGE PASSWORD
// ========================================

router.put(
  "/password",
  protect,
  changePassword
);

module.exports = router;