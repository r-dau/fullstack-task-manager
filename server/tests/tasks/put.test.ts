import request from "supertest";
import app from "../../src/app";
import {
  createTestTask,
  getInvalidId,
  getNonExistentId,
  clearDatabase,
} from "../utils/testHelpers";
import { getTestToken } from "../utils/getTestToken";

describe("PUT /tasks/:id", () => {
  let taskIdToUpdate: number;
  let token: string;

  beforeEach(async () => {
    await clearDatabase();

    const auth = await getTestToken();
    token = auth.token;

    const task = await createTestTask(token, {
      title: "Original Title",
      description: "Original Description",
    });

    taskIdToUpdate = task.id;
  });

  it("should fully update an existing task", async () => {
    const updatedData = {
      title: "Updated Title",
      description: "Updated Description",
      completed: true,
    };

    const response = await request(app)
      .put(`/tasks/${taskIdToUpdate}`)
      .send(updatedData)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedData);
  });

  it("should return 400 for invalid ID format", async () => {
    const response = await request(app)
      .put(`/tasks/${getInvalidId()}`)
      .send({
        title: "Test",
        description: "Test",
        completed: false,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const response = await request(app)
      .put(`/tasks/${getNonExistentId()}`)
      .send({
        title: "Does not exist",
        description: "Test",
        completed: false,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "error",
      "Task not found or update failed"
    );
  });

  it("should return 400 if title is missing", async () => {
    const response = await request(app)
      .put(`/tasks/${taskIdToUpdate}`)
      .send({
        description: "No title",
        completed: false,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title is required and must be a non-empty string"
    );
  });

  it("should return 400 if 'completed' is not a boolean", async () => {
    const response = await request(app)
      .put(`/tasks/${taskIdToUpdate}`)
      .send({
        title: "Invalid completed type",
        description: "Completed is not boolean",
        completed: 123,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Completed must be a boolean"
    );
  });
});
