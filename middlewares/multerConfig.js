const multer = require("multer");
const path = require("path");

// Folder upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/absensi"));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `absen_${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
