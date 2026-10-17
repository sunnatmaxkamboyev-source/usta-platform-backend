
const mongoose = require("mongoose");
const WorkSample = require("../models/WorkSample");

// ========================================
// USTANING ISH NAMUNALARINI OLISH
// ========================================
const getMyWorkSamples = async (req, res) => {
  try {
    const samples = await WorkSample.find({
      usta: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: samples.length,
      samples,
    });
  } catch (error) {
    console.error("Get work samples error:", error);

    return res.status(500).json({
      success: false,
      message: "Ish namunalarini olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// BARCHAGA OCHIQ ISH NAMUNALARINI OLISH
// ========================================
const getPublicWorkSamples = async (req, res) => {
  try {
    const { ustaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ustaId)) {
      return res.status(400).json({
        success: false,
        message: "Usta ID noto'g'ri",
      });
    }

    const samples = await WorkSample.find({
      usta: ustaId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: samples.length,
      samples,
    });
  } catch (error) {
    console.error("Get public work samples error:", error);

    return res.status(500).json({
      success: false,
      message: "Ish namunalarini olishda xatolik yuz berdi",
    });
  }
};

// ========================================
// YANGI ISH NAMUNASI YARATISH
// ========================================
const createWorkSample = async (req, res) => {
  try {
    const { title, description, images = [] } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Ish nomi va tavsifini kiriting",
      });
    }

    if (!Array.isArray(images) || images.length > 3) {
      return res.status(400).json({
        success: false,
        message: "Ko'pi bilan 3 ta rasm yuborish mumkin",
      });
    }

    if (!images.every((image) => typeof image === "string")) {
      return res.status(400).json({
        success: false,
        message: "Rasm ma'lumotlari noto'g'ri",
      });
    }

    const sample = await WorkSample.create({
      title: title.trim(),
      description: description.trim(),
      images,
      usta: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Ish namunasi yaratildi",
      sample,
    });
  } catch (error) {
    console.error("Create work sample error:", error);

    return res.status(500).json({
      success: false,
      message: "Ish namunasini yaratishda xatolik yuz berdi",
    });
  }
};

// ========================================
// ISH NAMUNASINI TAHRIRLASH
// ========================================
const updateWorkSample = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Ish namunasi ID noto'g'ri",
      });
    }

    const sample = await WorkSample.findOne({
      _id: id,
      usta: req.user.id,
    });

    if (!sample) {
      return res.status(404).json({
        success: false,
        message: "Ish namunasi topilmadi",
      });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Ish nomi bo'sh bo'lmasligi kerak",
        });
      }

      sample.title = title.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Tavsif bo'sh bo'lmasligi kerak",
        });
      }

      sample.description = description.trim();
    }

    if (images !== undefined) {
      if (
        !Array.isArray(images) ||
        images.length > 3 ||
        !images.every((image) => typeof image === "string")
      ) {
        return res.status(400).json({
          success: false,
          message: "Ko'pi bilan 3 ta rasm yuborish mumkin",
        });
      }

      sample.images = images;
    }

    await sample.save();

    return res.status(200).json({
      success: true,
      message: "Ish namunasi yangilandi",
      sample,
    });
  } catch (error) {
    console.error("Update work sample error:", error);

    return res.status(500).json({
      success: false,
      message: "Ish namunasini yangilashda xatolik yuz berdi",
    });
  }
};

// ========================================
// ISH NAMUNASINI O'CHIRISH
// ========================================
const deleteWorkSample = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Ish namunasi ID noto'g'ri",
      });
    }

    const sample = await WorkSample.findOneAndDelete({
      _id: id,
      usta: req.user.id,
    });

    if (!sample) {
      return res.status(404).json({
        success: false,
        message: "Ish namunasi topilmadi",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ish namunasi o'chirildi",
    });
  } catch (error) {
    console.error("Delete work sample error:", error);

    return res.status(500).json({
      success: false,
      message: "Ish namunasini o'chirishda xatolik yuz berdi",
    });
  }
};

module.exports = {
  getMyWorkSamples,
  getPublicWorkSamples,
  createWorkSample,
  updateWorkSample,
  deleteWorkSample,
};
