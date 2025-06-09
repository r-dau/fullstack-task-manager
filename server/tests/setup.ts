import { execSync } from "child_process";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env.test" });

console.log("USING DB:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function verifyConnection() {
  const tables = await prisma.$queryRaw<
    any[]
  >`SELECT name FROM sqlite_master WHERE type='table'`;
  console.log("Test DB Tables:", tables);
}

beforeAll(async () => {
  execSync(
    "npx prisma db push --force-reset --skip-generate --schema=./prisma/schema.prisma",
    {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL!,
      },
    }
  );

  await verifyConnection();
});

afterAll(async () => {
  await prisma.$disconnect();
});
