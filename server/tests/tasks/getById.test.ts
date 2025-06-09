import request from "supertest";
import app from "../../src/app";
import {
  createTestTask,
  getInvalidId,
  getNonExistentId,
  clearDatabase,
} from "../utils/testHelpers";
import { getTestToken } from "../utils/getTestToken";

describe("GET /tasks/:id", () => {
  let createdTaskId: number;
  let token: string;

  beforeEach(async () => {
    await clearDatabase();

    const auth = await getTestToken();
    token = auth.token;

    const task = await createTestTask(token, { title: "Test Task for GET" });
    createdTaskId = task.id;
  });

  it("should return 200 and the task if ID is valid", async () => {
    const res = await request(app)
      .get(`/tasks/${createdTaskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", createdTaskId);
    expect(res.body).toHaveProperty("title", "Test Task for GET");
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app)
      .get(`/tasks/${getInvalidId()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const res = await request(app)
      .get(`/tasks/${getNonExistentId()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Task not found");
  });
});
