const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const { prosesAbsensi } = require("../controllers/absensiController");
const { getAbsensi } = require("../controllers/getAbsensi");

router.post("/", upload.single("photo"), prosesAbsensi);
router.get("/", getAbsensi);

module.exports = router;
