import request from "supertest";
import app from "../../src/app";
import {
  createTestTask,
  getInvalidId,
  getNonExistentId,
} from "../utils/testHelpers";

describe("GET /tasks/:id", () => {
  let createdTaskId: number;

  beforeAll(async () => {
    const task = await createTestTask({ title: "Test Task for GET" });
    createdTaskId = task.id;
  });

  it("should return 200 and the task if ID is valid", async () => {
    const res = await request(app).get(`/tasks/${createdTaskId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", createdTaskId);
    expect(res.body).toHaveProperty("title", "Test Task for GET");
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app).get(`/tasks/${getInvalidId()}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const res = await request(app).get(`/tasks/${getNonExistentId()}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Task not found");
  });
});
