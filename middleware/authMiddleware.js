const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // Authorization headerni olish
    const authHeader = req.headers.authorization;

    // Token mavjudligini tekshirish
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Kirish uchun token kerak",
      });
    }

    // Bearer tokenni ajratish
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token noto'g'ri",
      });
    }

    // JWT tokenni tekshirish
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // User ma'lumotini requestga qo'shish
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token noto'g'ri yoki muddati tugagan",
    });
  }
};

module.exports = protect;