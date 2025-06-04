import { Router } from "express";
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

export default router;
