const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const User = require("../models/User");
const Vacancy = require("../models/Vacancy");

// ========================================
// ADMIN LOGIN
// ========================================

const adminLogin = async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Username va parolni kiriting",
      });
    }

    const admin =
      await Admin.findOne({
        username,
      });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message:
          "Username yoki parol noto'g'ri",
      });
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Username yoki parol noto'g'ri",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,

      message:
        "Admin muvaffaqiyatli tizimga kirdi",

      token,

      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Serverda xatolik yuz berdi",
    });
  }
};

// ========================================
// GET ADMIN PROFILE
// ========================================

const getAdminProfile = async (
  req,
  res
) => {
  try {
    const admin =
      await Admin.findById(
        req.admin.id
      ).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin topilmadi",
      });
    }

    return res.status(200).json({
      success: true,

      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        role: admin.role,
        createdAt:
          admin.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Get admin profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Admin ma'lumotlarini olishda xatolik",
    });
  }
};

// ========================================
// UPDATE ADMIN PROFILE
// ========================================

const updateAdminProfile = async (
  req,
  res
) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Admin nomini kiriting",
      });
    }

    const admin =
      await Admin.findById(
        req.admin.id
      );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin topilmadi",
      });
    }

    admin.name = name.trim();

    await admin.save();

    return res.status(200).json({
      success: true,

      message:
        "Admin ma'lumotlari muvaffaqiyatli saqlandi",

      admin: {
        id: admin._id,
        name: admin.name,
        username:
          admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(
      "Update admin profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Admin ma'lumotlarini yangilashda xatolik",
    });
  }
};

// ========================================
// CHANGE ADMIN PASSWORD
// ========================================

const changeAdminPassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Joriy va yangi parolni kiriting",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak",
      });
    }

    const admin =
      await Admin.findById(
        req.admin.id
      );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Admin topilmadi",
      });
    }

    const isCurrentPasswordCorrect =
      await bcrypt.compare(
        currentPassword,
        admin.password
      );

    if (
      !isCurrentPasswordCorrect
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Joriy parol noto'g'ri",
      });
    }

    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        admin.password
      );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "Yangi parol eski paroldan farq qilishi kerak",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    admin.password =
      hashedPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message:
        "Admin paroli muvaffaqiyatli o'zgartirildi",
    });
  } catch (error) {
    console.error(
      "Change admin password error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Parolni o'zgartirishda xatolik yuz berdi",
    });
  }
};

// ========================================
// ADMIN DASHBOARD STATISTICS
// ========================================

const getDashboardStats = async (
  req,
  res
) => {
  try {
    const totalMasters =
      await User.countDocuments({
        role: "usta",
      });

    const totalVacancies =
      await Vacancy.countDocuments();

    const activeVacancies =
      await Vacancy.countDocuments({
        status: "active",
      });

    const deletedVacancies =
      await Vacancy.countDocuments({
        status: "deleted",
      });

    const viewsResult =
      await Vacancy.aggregate([
        {
          $group: {
            _id: null,
            totalViews: {
              $sum: "$views",
            },
          },
        },
      ]);

    let totalViews = 0;

    if (viewsResult.length > 0) {
      totalViews =
        viewsResult[0].totalViews;
    }

    const latestVacancies =
      await Vacancy.find()
        .populate(
          "usta",
          "name phone profession"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    return res.status(200).json({
      success: true,

      stats: {
        totalMasters,
        totalVacancies,
        activeVacancies,
        deletedVacancies,
        totalViews,
      },

      latestVacancies,
    });
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Dashboard ma'lumotlarini olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// GET ALL MASTERS
// ========================================

const getAllMasters = async (
  req,
  res
) => {
  try {
    const masters =
      await User.find({
        role: "usta",
      })
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: masters.length,
      masters,
    });
  } catch (error) {
    console.error(
      "Get all masters error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Ustalarni olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// GET SINGLE MASTER
// ========================================

const getMasterById = async (
  req,
  res
) => {
  try {
    const master =
      await User.findOne({
        _id: req.params.id,
        role: "usta",
      }).select("-password");

    if (!master) {
      return res.status(404).json({
        success: false,
        message:
          "Usta topilmadi",
      });
    }

    return res.status(200).json({
      success: true,
      master,
    });
  } catch (error) {
    console.error(
      "Get master error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Ustani olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// DELETE MASTER
// ========================================

const deleteMaster = async (
  req,
  res
) => {
  try {
    const master =
      await User.findOne({
        _id: req.params.id,
        role: "usta",
      });

    if (!master) {
      return res.status(404).json({
        success: false,
        message:
          "Usta topilmadi",
      });
    }

    await Vacancy.updateMany(
      {
        usta: master._id,
      },
      {
        $set: {
          status: "deleted",
        },
      }
    );

    await User.findByIdAndDelete(
      master._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Usta muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error(
      "Delete master error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Ustani o'chirishda xatolik yuz berdi",
    });
  }
};

// ========================================
// GET ALL VACANCIES
// ========================================

const getAllVacancies = async (
  req,
  res
) => {
  try {
    const vacancies =
      await Vacancy.find()
        .populate(
          "usta",
          "name phone profession"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: vacancies.length,
      vacancies,
    });
  } catch (error) {
    console.error(
      "Get all vacancies error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Vakansiyalarni olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// GET SINGLE VACANCY
// ========================================

const getVacancyByAdmin = async (
  req,
  res
) => {
  try {
    const vacancy =
      await Vacancy.findById(
        req.params.id
      ).populate(
        "usta",
        "name phone profession"
      );

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message:
          "Vakansiya topilmadi",
      });
    }

    return res.status(200).json({
      success: true,
      vacancy,
    });
  } catch (error) {
    console.error(
      "Get admin vacancy error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Vakansiyani olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// DELETE VACANCY BY ADMIN
// ========================================

const deleteVacancyByAdmin = async (
  req,
  res
) => {
  try {
    const vacancy =
      await Vacancy.findById(
        req.params.id
      );

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message:
          "Vakansiya topilmadi",
      });
    }

    vacancy.status =
      "deleted";

    await vacancy.save();

    return res.status(200).json({
      success: true,
      message:
        "Vakansiya muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error(
      "Admin delete vacancy error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Vakansiyani o'chirishda xatolik yuz berdi",
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
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
};