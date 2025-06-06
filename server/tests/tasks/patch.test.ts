import request from "supertest";
import app from "../../src/app";
import {
  createTestTask,
  getInvalidId,
  getNonExistentId,
} from "../utils/testHelpers";

describe("PATCH /tasks/:id", () => {
  let taskId: number;

  beforeAll(async () => {
    const task = await createTestTask();
    taskId = task.id;
  });

  it("should update the completed status successfully", async () => {
    const response = await request(app).patch(`/tasks/${taskId}`).send({
      completed: true,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", taskId);
    expect(response.body).toHaveProperty("completed", true);
  });

  it("should return 400 for invalid ID format", async () => {
    const response = await request(app).patch(`/tasks/${getInvalidId()}`).send({
      completed: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const response = await request(app)
      .patch(`/tasks/${getNonExistentId()}`)
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
    const response = await request(app).patch(`/tasks/${taskId}`).send({
      completed: "not-a-boolean",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Completed must be a boolean"
    );
  });
});
