
const express = require("express");

const {
  getMyWorkSamples,
  getPublicWorkSamples,
  createWorkSample,
  updateWorkSample,
  deleteWorkSample,
} = require("../controllers/workSampleController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

// Muayyan ustaning ish namunalari
router.get("/usta/:ustaId", getPublicWorkSamples);

// ========================================
// PROTECTED USTA ROUTES
// ========================================

// Ustaning o'z ish namunalari
router.get("/my", protect, getMyWorkSamples);

// Yangi ish namunasi yaratish
router.post("/", protect, createWorkSample);

// Ish namunasini tahrirlash
router.put("/:id", protect, updateWorkSample);

// Ish namunasini o'chirish
router.delete("/:id", protect, deleteWorkSample);

module.exports = router;
