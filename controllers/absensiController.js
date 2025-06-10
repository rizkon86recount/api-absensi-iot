const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { spawn } = require("child_process");
const sendAbsensiPhotoToTelegram = require("../services/notifService");

async function prosesAbsensi(req, res) {
  try {
    const photoPath = req.file.path;

    // 1. Panggil script Python + kirim path gambar
    const python = spawn("./venv-face/bin/python", [
      path.join(__dirname, "../services/recognize.py"),
      photoPath,
    ]);

    let dataBuffer = "";

    python.stdout.on("data", (data) => {
      dataBuffer += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
    });

    python.on("close", async (code) => {
      const recognizedName = dataBuffer.trim();

      if (!recognizedName || recognizedName === "unknown") {
        return res
          .status(200)
          .json({ status: "GAGAL", message: "Wajah tidak dikenali" });
      }

      // 2. Cari user berdasarkan nama
      const user = await prisma.user.findFirst({
        where: { faceId: recognizedName },
      });

      if (!user) {
        return res
          .status(404)
          .json({ status: "GAGAL", message: "User tidak ditemukan" });
      }

      // 3. Simpan log absensi
      const log = await prisma.absensi.create({
        data: {
          userId: user.id,
          photo: path.basename(photoPath),
          status: "HADIR",
        },
      });

      // ✅ Format waktu ke 24-jam dan zona Asia/Jakarta
      const waktuFormatted = new Date(log.timestamp).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      // 4. Kirim notifikasi ke Telegram
      await sendAbsensiPhotoToTelegram(photoPath, user.name, log.timestamp);

      return res
        .status(200)
        .json({ status: "HADIR", user: user.name, waktu: log.timestamp });
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "ERROR", message: "Terjadi kesalahan server" });
  }
}

module.exports = { prosesAbsensi };
