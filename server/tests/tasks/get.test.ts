import request from "supertest";
import app from "../../src/app";
import { createTestTask, clearDatabase } from "../utils/testHelpers";
import { getTestToken } from "../utils/getTestToken";

describe("GET /tasks", () => {
  let token: string;

  beforeEach(async () => {
    await clearDatabase();

    const auth = await getTestToken();
    token = auth.token;

    await createTestTask(token);
  });

  it("should return 200 and an array of tasks", async () => {
    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("completed");
  });
});
