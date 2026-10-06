const express = require("express");

const {
  adminLogin,

  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,

  getDashboardStats,

  getAllMasters,
  getMasterById,
  deleteMaster,

  getAllVacancies,
  getVacancyByAdmin,
  deleteVacancyByAdmin,
} = require("../controllers/adminController");

const adminProtect = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// ========================================
// ADMIN LOGIN
// ========================================

router.post(
  "/login",
  adminLogin
);

// ========================================
// ADMIN PROFILE
// ========================================

// Admin ma'lumotlarini olish
router.get(
  "/profile",
  adminProtect,
  getAdminProfile
);

// Admin nomini o'zgartirish
router.put(
  "/profile",
  adminProtect,
  updateAdminProfile
);

// ========================================
// ADMIN PASSWORD
// ========================================

router.put(
  "/password",
  adminProtect,
  changeAdminPassword
);

// ========================================
// ADMIN DASHBOARD
// ========================================

router.get(
  "/dashboard",
  adminProtect,
  getDashboardStats
);

// ========================================
// MASTERS
// ========================================

router.get(
  "/masters",
  adminProtect,
  getAllMasters
);

router.get(
  "/masters/:id",
  adminProtect,
  getMasterById
);

router.delete(
  "/masters/:id",
  adminProtect,
  deleteMaster
);

// ========================================
// VACANCIES
// ========================================

router.get(
  "/vacancies",
  adminProtect,
  getAllVacancies
);

router.get(
  "/vacancies/:id",
  adminProtect,
  getVacancyByAdmin
);

router.delete(
  "/vacancies/:id",
  adminProtect,
  deleteVacancyByAdmin
);

// ========================================
// ADMIN JWT TEST
// ========================================

router.get(
  "/test",
  adminProtect,
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Admin JWT himoyasi ishlayapti",
      admin: req.admin,
    });
  }
);

module.exports = router;