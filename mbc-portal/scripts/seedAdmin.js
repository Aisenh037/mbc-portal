// scripts/seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../backend/src/models/User.js"; // adjust path if your User model is elsewhere

dotenv.config({ path: "../backend/.env" });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ userid: "admin001" });
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin@123", 10);

    const adminUser = new User({
      userid: "admin001",
      name: "Super Admin",
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true, // so you can log in without OTP loop
    });

    await adminUser.save();
    console.log("🚀 Admin account seeded successfully");
    console.log("👉 userid: admin001 | password: admin@123");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed", err);
    process.exit(1);
  }
};

seedAdmin();
