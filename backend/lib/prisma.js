// backend/lib/prisma.js
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const logger = require("./logger");

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["query", "error", "warn"],
    errorFormat: "minimal",
  });
}

let prisma;
if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  if (!global.__prismaClient) global.__prismaClient = createPrismaClient();
  prisma = global.__prismaClient;
}

async function disconnectPrisma() {
  await prisma.$disconnect();
  logger.info("Prisma client disconnected");
}
process.on("SIGINT", async () => { await disconnectPrisma(); process.exit(0); });
process.on("SIGTERM", async () => { await disconnectPrisma(); process.exit(0); });

module.exports = prisma;