const Vacancy = require("../models/Vacancy");

// ========================================
// CREATE VACANCY
// ========================================

const createVacancy = async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      price,
      description,
      contactPhone,
      telegram,
    } = req.body;

    // Ma'lumotlarni tekshirish
    if (
      !title ||
      !category ||
      !location ||
      !description ||
      !contactPhone ||
      !telegram
    ) {
      return res.status(400).json({
        success: false,
        message: "Barcha kerakli maydonlarni to'ldiring",
      });
    }

    // Yangi vakansiya yaratish
    const vacancy = await Vacancy.create({
      title,
      category,
      location,
      price: price || "Kelishiladi",
      description,
      contactPhone,
      telegram,
      usta: req.user.id,
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "Vakansiya muvaffaqiyatli yaratildi",
      vacancy,
    });
  } catch (error) {
    console.error("Create vacancy error:", error);

    res.status(500).json({
      success: false,
      message: "Vakansiya yaratishda xatolik yuz berdi",
    });
  }
};

// ========================================
// GET ALL VACANCIES
// ========================================

const getVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find({
      status: "active",
    })
      .populate(
        "usta",
        "name phone profession profileImage"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: vacancies.length,
      vacancies,
    });
  } catch (error) {
    console.error("Get vacancies error:", error);

    res.status(500).json({
      success: false,
      message: "Vakansiyalarni olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// GET SINGLE VACANCY
// ========================================

const getVacancyById = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(
      req.params.id
    ).populate(
      "usta",
      "name phone profession profileImage"
    );

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: "Vakansiya topilmadi",
      });
    }

    // Ko'rishlar sonini oshirish
    vacancy.views += 1;

    await vacancy.save();

    res.status(200).json({
      success: true,
      vacancy,
    });
  } catch (error) {
    console.error("Get vacancy error:", error);

    res.status(500).json({
      success: false,
      message: "Vakansiyani olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// GET MY VACANCIES
// ========================================

const getMyVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find({
      usta: req.user.id,
      status: {
        $ne: "deleted",
      },
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: vacancies.length,
      vacancies,
    });
  } catch (error) {
    console.error("Get my vacancies error:", error);

    res.status(500).json({
      success: false,
      message: "Vakansiyalarni olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// UPDATE VACANCY
// ========================================

const updateVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(
      req.params.id
    );

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: "Vakansiya topilmadi",
      });
    }

    // Vakansiya shu ustaga tegishlimi?
    if (
      vacancy.usta.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Bu vakansiyani tahrirlash huquqingiz yo'q",
      });
    }

    const {
      title,
      category,
      location,
      price,
      description,
      contactPhone,
      telegram,
    } = req.body;

    vacancy.title = title ?? vacancy.title;
    vacancy.category = category ?? vacancy.category;
    vacancy.location = location ?? vacancy.location;
    vacancy.price = price ?? vacancy.price;
    vacancy.description = description ?? vacancy.description;
    vacancy.contactPhone = contactPhone ?? vacancy.contactPhone;
    vacancy.telegram = telegram ?? vacancy.telegram;

    await vacancy.save();

    res.status(200).json({
      success: true,
      message: "Vakansiya muvaffaqiyatli yangilandi",
      vacancy,
    });
  } catch (error) {
    console.error("Update vacancy error:", error);

    res.status(500).json({
      success: false,
      message: "Vakansiyani yangilashda xatolik yuz berdi",
    });
  }
};

// ========================================
// DELETE VACANCY
// ========================================

const deleteVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(
      req.params.id
    );

    if (!vacancy) {
      return res.status(404).json({
        success: false,
        message: "Vakansiya topilmadi",
      });
    }

    // Faqat egasi o'chira oladi
    if (
      vacancy.usta.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Bu vakansiyani o'chirish huquqingiz yo'q",
      });
    }

    // Soft delete
    vacancy.status = "deleted";

    await vacancy.save();

    res.status(200).json({
      success: true,
      message: "Vakansiya muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error("Delete vacancy error:", error);

    res.status(500).json({
      success: false,
      message: "Vakansiyani o'chirishda xatolik yuz berdi",
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  createVacancy,
  getVacancies,
  getVacancyById,
  getMyVacancies,
  updateVacancy,
  deleteVacancy,
};
