const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const { prosesAbsensi } = require("../controllers/absensiController");

router.post("/", upload.single("photo"), prosesAbsensi);

module.exports = router;
