import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/prisma";

const testUser = {
  email: "test@example.com",
  password: "securePassword123",
  name: "Test User",
};

beforeAll(async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
});

describe("Auth Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should login the user and return a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongPassword",
    });
    expect(res.statusCode).toBe(401);
  });

  it("should reject access to protected route without token", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(401);
  });

  it("should reject access to protected route with invalid token", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", "Bearer invalidtoken123");
    expect(res.statusCode).toBe(403);
  });

  it("should allow access with valid token", async () => {
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    const token = loginRes.body.token;

    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
});
