import { execSync } from "child_process";

// Prepare test database
beforeAll(() => {
  process.env.DATABASE_URL = "file:./test.db";

  execSync(
    "npx prisma db push --force-reset --skip-generate --schema=./prisma/schema.prisma",
    { stdio: "inherit" }
  );
});
