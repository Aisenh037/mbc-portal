// backend/src/utils/seed.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const ensureAdminExists = async () => {
  const existing = await User.findOne({ userId: "admin@mbc.com" });
  if (!existing) {
    const hashedPassword = await bcrypt.hash("admin@123", 10);
    await User.create({
      userId: "admin@mbc.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
    });
    console.log("🚀 Default admin created (userId: admin001, password: admin@123)");
  }
};