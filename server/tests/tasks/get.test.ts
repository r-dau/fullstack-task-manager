import request from "supertest";
import app from "../../src/app";
import { createTestTask } from "../utils/testHelpers";

describe("GET /tasks", () => {
  beforeAll(async () => {
    await createTestTask();
  });

  it("should return 200 and an array of tasks", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("completed");
  });
});
