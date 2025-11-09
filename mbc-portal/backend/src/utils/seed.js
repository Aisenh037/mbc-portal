import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import { env } from "../config/env.js";

// Load environment variables from the backend's .env file
dotenv.config({ path: "./.env" });

const seedAdmin = async () => {
  if (!env.MONGO_URI) {
    console.error("❌ MONGO_URI not found in .env file. Make sure it's configured.");
    process.exit(1);
  }

  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding.");

    const existingAdmin = await User.findOne({ userId: env.DEFAULT_ADMIN_USERID });
    if (existingAdmin) {
      console.log("✅ Admin user already exists.");
    } else {
      const hashedPassword = await bcrypt.hash(env.DEFAULT_ADMIN_PASSWORD, 10);
      await User.create({
        userId: env.DEFAULT_ADMIN_USERID,
        name: "Super Admin",
        email: env.DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        isEmailVerified: true,
      });
      console.log(`🚀 Default admin created successfully!`);
      console.log(`   - UserID: ${env.DEFAULT_ADMIN_USERID}`);
      console.log(`   - Password: ${env.DEFAULT_ADMIN_PASSWORD}`);
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedAdmin();