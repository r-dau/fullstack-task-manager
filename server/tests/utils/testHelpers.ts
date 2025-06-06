import request from "supertest";
import app from "../../src/app";

export async function createTestTask(overrides = {}) {
  const defaultTask = {
    title: "Test Task",
    description: "Test Description",
    completed: false,
    ...overrides,
  };

  const response = await request(app).post("/tasks").send(defaultTask);
  return response.body;
}

export function getInvalidId(): any {
  return "not-a-valid-id";
}

export function getNonExistentId(): number {
  return 999999;
}
