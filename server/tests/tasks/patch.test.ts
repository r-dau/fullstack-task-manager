import request from "supertest";
import app from "../../src/app";
import {
  createTestTask,
  getInvalidId,
  getNonExistentId,
  clearDatabase,
} from "../utils/testHelpers";
import { getTestToken } from "../utils/getTestToken";

describe("PATCH /tasks/:id", () => {
  let taskId: number;
  let token: string;

  beforeEach(async () => {
    await clearDatabase();

    const auth = await getTestToken();
    token = auth.token;

    const task = await createTestTask(token);

    if (!task || typeof task.id !== "number") {
      throw new Error("Failed to create test task");
    }

    taskId = task.id;
  });

  it("should update the completed status successfully", async () => {
    const response = await request(app)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        completed: true,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", taskId);
    expect(response.body).toHaveProperty("completed", true);
  });

  it("should return 400 for invalid ID format", async () => {
    const response = await request(app)
      .patch(`/tasks/${getInvalidId()}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        completed: true,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const response = await request(app)
      .patch(`/tasks/${getNonExistentId()}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        completed: true,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "error",
      "Task not found or update failed"
    );
  });

  it("should return 400 if completed is not a boolean", async () => {
    const response = await request(app)
      .patch(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        completed: "not-a-boolean",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Completed must be a boolean"
    );
  });
});
