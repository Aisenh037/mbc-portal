import multer from 'multer';
import { storage } from '../config/cloudinary.js'; // Import Cloudinary storage

function fileFilter(req, file, cb) {
  // You can add more robust file type filtering here if needed
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(file.originalname.split('.').pop());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File type not allowed. Only images, PDFs, and docs are supported.'));
}

export const upload = multer({
  storage: storage, // Use Cloudinary storage
  fileFilter: fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB file limit
});