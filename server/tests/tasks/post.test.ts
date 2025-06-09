import request from "supertest";
import app from "../../src/app";
import { getTestToken } from "../utils/getTestToken";

describe("POST /tasks", () => {
  let token: string;

  beforeAll(async () => {
    const auth = await getTestToken();
    token = auth.token;
  });

  it("should create a new task and return 201 with the task data", async () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
    };

    const response = await request(app)
      .post("/tasks")
      .send(taskData)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(taskData.title);
    expect(response.body.description).toBe(taskData.description);
  });

  it("should return 400 if title is missing", async () => {
    const taskData = {
      description: "Task without a title",
    };

    const response = await request(app)
      .post("/tasks")
      .send(taskData)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title is required and must be a string"
    );
  });

  it("should return 400 if title is not a string", async () => {
    const taskData = {
      title: 12345, // Ungültiger Typ
      description: "Task with numeric title",
    };

    const response = await request(app)
      .post("/tasks")
      .send(taskData)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title is required and must be a string"
    );
  });
});
