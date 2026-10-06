const jwt = require("jsonwebtoken");

const adminProtect = (
  req,
  res,
  next
) => {
  try {
    // Authorization header
    const authHeader =
      req.headers.authorization;

    // Token yo'q
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Admin uchun token kerak",
      });
    }

    // Bearer TOKEN
    const token =
      authHeader.split(" ")[1];

    // Token noto'g'ri
    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Admin token noto'g'ri",
      });
    }

    // JWT tekshirish
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Admin ekanligini tekshirish
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Faqat admin uchun ruxsat berilgan",
      });
    }

    // Admin ma'lumotini requestga berish
    req.admin = decoded;

    next();
  } catch (error) {
    console.error(
      "Admin auth error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Admin token noto'g'ri yoki muddati tugagan",
    });
  }
};

module.exports = adminProtect;