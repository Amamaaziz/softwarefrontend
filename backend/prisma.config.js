// backend/prisma.config.js
require("dotenv").config();
const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    // used by `prisma migrate` / `db push`
    directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});