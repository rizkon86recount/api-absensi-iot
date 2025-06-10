const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendAbsensiPhotoToTelegram(photoPath, userName, waktu) {
  try {
    // Format waktu agar 24-jam dan zona WIB
    const formattedTime = new Date(waktu).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append(
      "caption",
      `✅ *${userName}* telah absen pada *${formattedTime} WIB*`
    );
    form.append("parse_mode", "Markdown");
    form.append("photo", fs.createReadStream(photoPath));

    console.log("📤 Kirim ke Telegram:", { userName, formattedTime });

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    console.log("✅ Berhasil kirim foto ke Telegram.");
  } catch (error) {
    console.error("❌ Gagal kirim Telegram:", error.message);
  }
}

module.exports = sendAbsensiPhotoToTelegram;
