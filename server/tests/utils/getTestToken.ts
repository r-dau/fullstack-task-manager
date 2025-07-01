import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/prisma";

export async function getTestToken() {
  const user = {
    username: "tester",
    email: `tester${Date.now()}@example.com`,
    password: "securepassword",
  };

  await request(app).post("/api/auth/register").send(user);

  const res = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });

  return { token: res.body.token, userId: dbUser!.id };
}
