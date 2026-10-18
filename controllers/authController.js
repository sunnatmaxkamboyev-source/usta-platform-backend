
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================================
// REGISTER
// ========================================

const register = async (req, res) => {
  try {
    const { name, phone, password, profession } = req.body;

    if (!name || !phone || !password || !profession) {
      return res.status(400).json({
        success: false,
        message: "Barcha maydonlarni to'ldiring",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
      });
    }

    const existingUser = await User.findOne({
      phone: phone.trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Bu telefon raqam bilan akkaunt mavjud",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      phone: phone.trim(),
      password: hashedPassword,
      profession: profession.trim(),
      role: "usta",
    });

    return res.status(201).json({
      success: true,
      message: "Usta muvaffaqiyatli ro'yxatdan o'tdi",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        profession: user.profession,
        profileImage: user.profileImage || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Bu telefon raqam bilan akkaunt mavjud",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Serverda xatolik yuz berdi",
    });
  }
};

// ========================================
// LOGIN
// ========================================

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Telefon raqam va parolni kiriting",
      });
    }

    const user = await User.findOne({
      phone: phone.trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Telefon raqam yoki parol noto'g'ri",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Telefon raqam yoki parol noto'g'ri",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Muvaffaqiyatli kirildi",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        profession: user.profession,
        profileImage: user.profileImage || "",
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Serverda xatolik yuz berdi",
    });
  }
};

// ========================================
// GET CURRENT USER
// ========================================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GetMe error:", error);

    return res.status(500).json({
      success: false,
      message: "Serverda xatolik yuz berdi",
    });
  }
};

// ========================================
// UPDATE CURRENT USER PROFILE
// ========================================

const updateProfile = async (req, res) => {
  try {
    const { name, phone, profession, profileImage } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      typeof profession !== "string" ||
      !profession.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Ism, telefon va kasbni to'liq kiriting",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    const existingUser = await User.findOne({
      phone: phone.trim(),
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Bu telefon raqam boshqa akkauntga tegishli",
      });
    }

    // Profil rasmi yuborilgan bo'lsa, uni tekshiramiz.
    if (profileImage !== undefined) {
      if (typeof profileImage !== "string") {
        return res.status(400).json({
          success: false,
          message: "Profil rasmi formati noto'g'ri",
        });
      }

      if (
        profileImage !== "" &&
        !/^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(
          profileImage
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Profil rasmi formati noto'g'ri",
        });
      }

      // Rasmni foydalanuvchi hujjatiga yozamiz.
      user.profileImage = profileImage;

      console.log(
        "📸 Profil rasmi qabul qilindi. Belgilar soni:",
        profileImage.length
      );
    }

    user.name = name.trim();
    user.phone = phone.trim();
    user.profession = profession.trim();

    // O'zgarishlarni MongoDB bazasiga saqlaymiz.
    await user.save();

    // Saqlangan ma'lumotni bazadan qayta o'qiymiz.
    const savedUser = await User.findById(user._id).select("-password");

    console.log(
      "💾 Bazadan qayta o'qilgan rasm uzunligi:",
      savedUser?.profileImage?.length || 0
    );

    if (
      profileImage !== undefined &&
      profileImage !== "" &&
      !savedUser?.profileImage
    ) {
      return res.status(500).json({
        success: false,
        message: "Profil rasmi bazada saqlanmadi",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil muvaffaqiyatli yangilandi",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        phone: savedUser.phone,
        profession: savedUser.profession,
        profileImage: savedUser.profileImage || "",
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Bu telefon raqam boshqa akkauntga tegishli",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Profilni yangilashda xatolik yuz berdi",
    });
  }
};

// ========================================
// CHANGE USER PASSWORD
// ========================================

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Joriy va yangi parolni kiriting",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Joriy parol noto'g'ri",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Yangi parol eski paroldan farq qilishi kerak",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Parol muvaffaqiyatli o'zgartirildi",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Parolni o'zgartirishda xatolik yuz berdi",
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
