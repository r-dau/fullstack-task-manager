import request from "supertest";
import app from "../../src/app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function clearDatabase() {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
}

export interface TaskData {
  title: string;
  description?: string;
  completed?: boolean;
}

export async function createTestTask(
  token?: string,
  overrides: Partial<TaskData> = {}
) {
  const defaultTask: TaskData = {
    title: "Test Task",
    description: "Test Description",
    completed: false,
    ...overrides,
  };

  const req = request(app).post("/tasks").send(defaultTask);

  if (token) {
    req.set("Authorization", `Bearer ${token}`);
  }

  const response = await req;
  return response.body;
}

export function getInvalidId(): string {
  return "not-a-valid-id";
}

export function getNonExistentId(): number {
  return 999_999_999;
}
