import request from "supertest";
import app from "../src/app";

describe("GET /tasks", () => {
  it("should return 200 and an array of tasks", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("POST /tasks", () => {
  it("should create a new task and return 201 with the task data", async () => {
    const taskData = {
      title: "Test Task",
      description: "This is a test task",
    };

    const response = await request(app)
      .post("/tasks")
      .send(taskData)
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
      .set("Content-Type", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title is required and must be a string"
    );
  });
});

describe("GET /tasks/:id", () => {
  let createdTaskId: number;

  beforeAll(async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Test Task for GET" });

    createdTaskId = res.body.id;
  });

  it("should return 200 and the task if ID is valid", async () => {
    const res = await request(app).get(`/tasks/${createdTaskId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", createdTaskId);
    expect(res.body).toHaveProperty("title", "Test Task for GET");
  });

  it("should return 400 for invalid ID format", async () => {
    const res = await request(app).get("/tasks/abc");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const res = await request(app).get("/tasks/999999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Task not found");
  });
});

describe("PUT /tasks/:id", () => {
  let taskIdToUpdate: number;

  beforeAll(async () => {
    const response = await request(app).post("/tasks").send({
      title: "Original Title",
      description: "Original Description",
    });

    taskIdToUpdate = response.body.id;
  });

  it("should fully update an existing task", async () => {
    const updatedData = {
      title: "Updated Title",
      description: "Updated Description",
      completed: true,
    };

    const response = await request(app)
      .put(`/tasks/${taskIdToUpdate}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedData);
  });

  it("should return 400 for invalid ID format", async () => {
    const response = await request(app)
      .put("/tasks/invalid-id")
      .send({ title: "Test", description: "Test", completed: false });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const nonExistentId = 999999;

    const response = await request(app).put(`/tasks/${nonExistentId}`).send({
      title: "Does not exist",
      description: "Test",
      completed: false,
    });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "error",
      "Task not found or update failed"
    );
  });

  it("should return 400 if title is missing", async () => {
    const response = await request(app).put(`/tasks/${taskIdToUpdate}`).send({
      description: "No title",
      completed: false,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Title is required and must be a non-empty string"
    );
  });

  it("should return 400 if 'completed' is not a boolean", async () => {
    const response = await request(app).put(`/tasks/${taskIdToUpdate}`).send({
      title: "Invalid completed type",
      description: "Completed is not boolean",
      completed: 123, // invalid type
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Completed must be a boolean"
    );
  });
});

describe("DELETE /tasks/:id", () => {
  let taskIdToDelete: number;

  beforeAll(async () => {
    const response = await request(app).post("/tasks").send({
      title: "Task to delete",
      description: "This task will be deleted",
    });
    taskIdToDelete = response.body.id;
  });

  it("should delete a task and return 200", async () => {
    const response = await request(app).delete(`/tasks/${taskIdToDelete}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", taskIdToDelete);
  });

  it("should return 400 for invalid ID format", async () => {
    const response = await request(app).delete("/tasks/invalid-id");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const nonExistentId = 99999; // assuming it doesn't exist
    const response = await request(app).delete(`/tasks/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "error",
      "Task not found or delete failed"
    );
  });
});

describe("PATCH /tasks/:id", () => {
  let taskId: number;

  beforeAll(async () => {
    // Erstelle eine Task, die wir patchen können
    const res = await request(app).post("/tasks").send({
      title: "Patch test task",
      description: "Testing patch endpoint",
    });
    taskId = res.body.id;
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
    const response = await request(app).patch("/tasks/invalid-id").send({
      completed: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID format");
  });

  it("should return 404 if task does not exist", async () => {
    const nonExistentId = 999999;
    const response = await request(app).patch(`/tasks/${nonExistentId}`).send({
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
