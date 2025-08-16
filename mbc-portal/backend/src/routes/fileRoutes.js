import express from "express";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload single file
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json({
      success: true,
      message: "File uploaded successfully",
      filePath: req.file.path,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Upload multiple files
router.post("/uploads", upload.array("files", 5), (req, res) => {
  try {
    res.json({
      success: true,
      message: "Files uploaded successfully",
      files: req.files.map((f) => f.path),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
