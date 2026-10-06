const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vacancyRoutes = require("./routes/vacancyRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ========================================
// EXPRESS APP
// ========================================

const app = express();

// ========================================
// PORT
// ========================================

const PORT =
  process.env.PORT || 5000;

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

// Usta authentication
app.use(
  "/api/auth",
  authRoutes
);

// Vacancy API
app.use(
  "/api/vacancies",
  vacancyRoutes
);

// Admin API
app.use(
  "/api/admin",
  adminRoutes
);

// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
  res.send(
    "Usta Platform API ishlayapti"
  );
});

// ========================================
// START SERVER
// ========================================

app.listen(
  PORT,
  () => {
    console.log(
      `Server ${PORT}-portda ishga tushdi`
    );
  }
);