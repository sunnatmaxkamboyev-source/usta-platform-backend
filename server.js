
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
const PORT = process.env.PORT || 5000;

// ========================================
// DATABASE
// ========================================

connectDB();

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

// JSON so'rovlar uchun hajm limiti.
// Base64 rasm yuborilganda JSON hajmi kattalashishini hisobga olamiz.
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// ========================================
// ROUTES
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/work-samples", workSampleRoutes);

// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).send("Usta Platform API ishlayapti");
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
  console.error("Server xatosi:", {
    message: err.message,
    type: err.type,
    status: err.status,
    path: req.originalUrl,
  });

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message:
        "So'rov hajmi juda katta. Rasmni kichraytirib qayta urinib ko'ring.",
    });
  }

  return res.status(err.status || 500).json({
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
