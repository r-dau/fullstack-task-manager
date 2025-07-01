import { createContext } from "react";
import type { Task } from "../types/Task";

export type TaskContextType = {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  createTask: (title: string) => Promise<void>;
  updateTask: (id: number, updatedFields: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
};

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);
