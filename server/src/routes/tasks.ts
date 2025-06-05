import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// Get all tasks
router.get("/", async (_req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// Create a new task
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  const newTask = await prisma.task.create({
    data: { title, description },
  });
  res.status(201).json(newTask);
});

// Update a task (toggle completed)
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const updatedTask = await prisma.task.update({
    where: { id: Number(id) },
    data: { completed },
  });
  res.json(updatedTask);
});

// Delete a task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.task.delete({
    where: { id: Number(id) },
  });
  res.status(204).send();
});

// Get single task by ID
router.get<{ id: string }>("/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }

  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Update a task (PUT)
router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, completed } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID format" });
    return;
  }
  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, completed },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(404).json({ error: "Task not found or update failed" });
  }
});

export default router;
