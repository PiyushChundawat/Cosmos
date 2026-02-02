const multer = require("multer");
const path = require("path");

// destination: backend/uploads/resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/resumes"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);           // .pdf
    const baseName = path.basename(file.originalname, ext); // resume
    cb(null, `${baseName}-${Date.now()}${ext}`);           // resume-123456.pdf
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = uploadResume;
