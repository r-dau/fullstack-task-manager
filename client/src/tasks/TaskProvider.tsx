import { useEffect, useState } from "react";
import { TaskContext } from "./TaskContext";
import type { TaskContextType } from "./TaskContext";
import type { Task } from "../types/Task";
import { useAuth } from "../auth/useAuth";

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (!user) return;
    const res = await fetch("/api/tasks", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = await res.json();
    setTasks(data);
  };

  // Placeholder-Funktionen für jetzt
  const createTask = async (title: string) => {
    console.log("Not implemented yet createTask: ", title);
  };

  const updateTask = async (id: number, updatedFields: Partial<Task>) => {
    console.log("Not implemented yet updateTask: ", id, updatedFields);
  };

  const deleteTask = async (id: number) => {
    console.log("Not implemented yet deleteTask: ", id);
  };

  useEffect(() => {
    fetchTasks().catch(console.error);
  }, [user]);

  const contextValue: TaskContextType = {
    tasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
