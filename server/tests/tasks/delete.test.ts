import request from "supertest";
import app from "../../src/app";
import {
  createTestTask,
  getInvalidId,
  getNonExistentId,
  clearDatabase,
} from "../utils/testHelpers";
import { getTestToken } from "../utils/getTestToken";

describe("DELETE /tasks/:id", () => {
  let taskIdToDelete: number;
  let token: string;

  beforeEach(async () => {
    await clearDatabase();

    const auth = await getTestToken();
    token = auth.token;

    const task = await createTestTask(token, {
      title: "Task to delete",
      description: "This task will be deleted",
    });

    taskIdToDelete = task.id;
  });

  it("should delete a task and return 200", async () => {
    const response = await request(app)
      .delete(`/tasks/${taskIdToDelete}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", taskIdToDelete);
  });

  it("should return 400 for invalid ID format", async () => {
    const response = await request(app)
      .delete(`/tasks/${getInvalidId()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const response = await request(app)
      .delete(`/tasks/${getNonExistentId()}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "error",
      "Task not found or delete failed"
    );
  });
});
