const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data user" });
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
  res.json(user);
};

// POST /api/users
exports.createUser = async (req, res) => {
  const { name, faceId, phoneNumber, role, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const user = await prisma.user.create({
      data: {
        name,
        faceId,
        phoneNumber,
        role,
        email,
        password: hashedPassword,
      },
    });

    // Hapus password sebelum dikirim ke client
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      status: "BERHASIL",
      user: userWithoutPassword,
    });
  } catch (error) {
    // Validasi duplicate faceId
    if (error.code === "P2002" && error.meta?.target?.includes("faceId")) {
      return res.status(400).json({
        status: "GAGAL",
        message: "Face ID sudah terdaftar, gunakan face ID lain.",
      });
    }

    console.error(error);
    return res.status(500).json({
      status: "ERROR",
      message: "Gagal menambah user",
    });
  }
};

// PUT /api/users/:id
// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, faceId, phoneNumber, role, email, password } = req.body;

  try {
    // Ambil data user lama
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Hash password hanya jika diberikan
    let hashedPassword = existingUser.password;
    if (password && password !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        faceId,
        phoneNumber,
        role,
        email,
        password: hashedPassword,
      },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Gagal memperbarui user" });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: "Gagal menghapus user" });
  }
};
