// middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { ValidationError } = require("../helpers/errors/customErrors");

// Fungsi untuk membuat middleware upload yang dinamis
const createUploadMiddleware = (folderName, options = {}) => {
  // Konfigurasi default
  const config = {
    allowedMimes: ["image/jpeg", "image/png", "image/gif"],
    maxSize: 15 * 1024 * 1024, // 15MB default
    filePrefix: "", // Prefix untuk nama file
    ...options,
  };

  // Buat direktori uploads/{folderName} jika belum ada
  const uploadDir = `uploads/${folderName}`;
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const prefix = config.filePrefix ? `${config.filePrefix}-` : "";
      cb(null, `${prefix}${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (config.allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ValidationError(
          `Invalid file type. Only ${config.allowedMimes.join(
            ", "
          )} are allowed.`
        ),
        false
      );
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: config.maxSize,
    },
  });

  // Helper untuk menghapus file
  const deleteFile = async (filepath) => {
    try {
      if (filepath) {
        const fullPath = path.join(__dirname, "..", filepath);
        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return {
    upload,
    deleteFile,
  };
};

// Buat instance untuk berbagai folder
const adminUpload = createUploadMiddleware("admin", {
  filePrefix: "admin",
  allowedMimes: ["image/jpeg", "image/png", "image/gif"],
  maxSize: 15 * 1024 * 1024, // 15MB
});

const layananUpload = createUploadMiddleware("layanan", {
  filePrefix: "layanan",
  allowedMimes: ["image/jpeg", "image/png",  "image/gif"], // Tambah PDF untuk layanan
  maxSize: 20 * 1024 * 1024, // 20MB
});

const userUpload = createUploadMiddleware("user", {
  filePrefix: "user",
  allowedMimes: ["image/jpeg", "image/png"], // Hanya izinkan JPEG dan PNG untuk user
  maxSize: 15 * 1024 * 1024, // 5MB
});

module.exports = {
  adminUpload,
  layananUpload,
  userUpload,
  createUploadMiddleware,
};
