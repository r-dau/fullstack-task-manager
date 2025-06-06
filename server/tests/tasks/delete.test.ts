import request from "supertest";
import app from "../../src/app";
import {
  createTestTask,
  getInvalidId,
  getNonExistentId,
} from "../utils/testHelpers";

describe("DELETE /tasks/:id", () => {
  let taskIdToDelete: number;

  beforeAll(async () => {
    const task = await createTestTask({
      title: "Task to delete",
      description: "This task will be deleted",
    });
    taskIdToDelete = task.id;
  });

  it("should delete a task and return 200", async () => {
    const response = await request(app).delete(`/tasks/${taskIdToDelete}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", taskIdToDelete);
  });

  it("should return 400 for invalid ID format", async () => {
    const response = await request(app).delete(`/tasks/${getInvalidId()}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const response = await request(app).delete(`/tasks/${getNonExistentId()}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "error",
      "Task not found or delete failed"
    );
  });
});
