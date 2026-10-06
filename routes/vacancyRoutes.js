const express = require("express");

const {
  createVacancy,
  getVacancies,
  getVacancyById,
  getMyVacancies,
  updateVacancy,
  deleteVacancy,
} = require("../controllers/vacancyController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// PUBLIC ROUTES
// ========================================

// Barcha faol vakansiyalar
router.get(
  "/",
  getVacancies
);


// ========================================
// PROTECTED USTA ROUTES
// ========================================

// Ustaning o'z vakansiyalari
router.get(
  "/my",
  protect,
  getMyVacancies
);

// Yangi vakansiya yaratish
router.post(
  "/",
  protect,
  createVacancy
);

// Vakansiyani tahrirlash
router.put(
  "/:id",
  protect,
  updateVacancy
);

// Vakansiyani o'chirish
router.delete(
  "/:id",
  protect,
  deleteVacancy
);


// ========================================
// PUBLIC SINGLE VACANCY
// ========================================

// Bitta vakansiya
router.get(
  "/:id",
  getVacancyById
);


module.exports = router;