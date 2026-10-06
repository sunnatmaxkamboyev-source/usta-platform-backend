const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const Admin = require("./models/Admin");

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("MongoDB ulandi");

    const existingAdmin =
      await Admin.findOne({
        username: "admin",
      });

    if (existingAdmin) {
      console.log(
        "Admin allaqachon mavjud"
      );

      // Eski admin uchun name bo'lmasa,
      // default name beramiz
      if (!existingAdmin.name) {
        existingAdmin.name = "Admin";

        await existingAdmin.save();

        console.log(
          "Admin nomi yangilandi: Admin"
        );
      }

      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(
        "admin123",
        10
      );

    const admin = await Admin.create({
      name: "Admin",
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    console.log(
      "Admin muvaffaqiyatli yaratildi"
    );

    console.log(
      "Name:",
      admin.name
    );

    console.log(
      "Username:",
      admin.username
    );

    console.log(
      "Role:",
      admin.role
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Admin yaratishda xatolik:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();