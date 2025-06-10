const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== "ADMIN") {
      return res
        .status(401)
        .json({ message: "Akun tidak ditemukan atau bukan admin" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login berhasil", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
}

module.exports = { login };
