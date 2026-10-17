const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vacancyRoutes = require("./routes/vacancyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const workSampleRoutes = require("./routes/workSampleRoutes");

// ========================================
// EXPRESS APP
// ========================================

const app = express();

// ========================================
// PORT
// ========================================

const PORT = process.env.PORT || 5000;

// ========================================
// DATABASE
// ========================================

connectDB();

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// ROUTES
// ========================================

// Authentication API
app.use("/api/auth", authRoutes);

// Vacancy API
app.use("/api/vacancies", vacancyRoutes);

// Admin API
app.use("/api/admin", adminRoutes);

// Work Samples API
app.use("/api/work-samples", workSampleRoutes);

// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
  res.send("Usta Platform API ishlayapti");
});

// ========================================
// 404 ROUTE
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API manzili topilmadi",
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error("Server xatosi:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.status && err.status < 500
        ? err.message
        : "Serverda xatolik yuz berdi",
  });
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi`);
});
