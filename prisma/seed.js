const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Fadly",
      faceId: "2",
      role: "USER",
      phoneNumber: "6281234567899",
    },
  });
  console.log("✅ Dummy user ditambahkan");
}

main().finally(() => prisma.$disconnect());
