const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAbsensi = async (req, res) => {
  const bulan = parseInt(req.query.bulan); // 1 - 12
  const tahun = parseInt(req.query.tahun); // 2025, dll

  try {
    const whereClause = {};

    if (!isNaN(bulan) && !isNaN(tahun)) {
      // Buat filter berdasarkan bulan dan tahun
      const awalBulan = new Date(tahun, bulan - 1, 1);
      const akhirBulan = new Date(tahun, bulan, 1);

      whereClause.timestamp = {
        gte: awalBulan,
        lt: akhirBulan,
      };
    }

    const data = await prisma.absensi.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            faceId: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: "asc" },
    });

    res.json({ status: "OK", total: data.length, data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "ERROR", message: "Gagal mengambil data absensi" });
  }
};
