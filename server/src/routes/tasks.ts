import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import ApiError from "../errors/ApiError";
import {
  authenticateToken,
  AuthenticatedRequest,
} from "../middlewares/authMiddleware";

const router = Router();

const parseId = (idParam: string): number | null => {
  const id = parseInt(idParam, 10);
  return isNaN(id) ? null : id;
};

// GET /tasks - get all tasks
router.get(
  "/",
  authenticateToken,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await prisma.task.findMany();
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
);

// POST /tasks - create a new task
router.post(
  "/",
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { title, description } = req.body;

    if (!title || typeof title !== "string") {
      return next(new ApiError(400, "Title is required and must be a string"));
    }

    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          user: {
            connect: { id: req?.user?.userId },
          },
        },
      });
      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  }
);

// GET /tasks/:id - get single task
router.get(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    if (id === null) return next(new ApiError(400, "Invalid ID format"));

    try {
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) return next(new ApiError(404, "Task not found"));
      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /tasks/:id - full update
router.put(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    const { title, description, completed } = req.body;

    if (id === null) return next(new ApiError(400, "Invalid ID format"));

    if (typeof title !== "string" || title.trim() === "") {
      return next(
        new ApiError(400, "Title is required and must be a non-empty string")
      );
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      return next(new ApiError(400, "Completed must be a boolean"));
    }

    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: { title, description, completed },
      });
      res.json(updatedTask);
    } catch (error) {
      next(new ApiError(404, "Task not found or update failed"));
    }
  }
);

// PATCH /tasks/:id - toggle completion
router.patch(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    const { completed } = req.body;

    if (id === null) return next(new ApiError(400, "Invalid ID format"));

    if (completed !== undefined && typeof completed !== "boolean") {
      return next(new ApiError(400, "Completed must be a boolean"));
    }

    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: { completed },
      });
      res.json(updatedTask);
    } catch (error) {
      next(new ApiError(404, "Task not found or update failed"));
    }
  }
);

// DELETE /tasks/:id - delete task
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);

    if (id === null) return next(new ApiError(400, "Invalid ID format"));

    try {
      const deletedTask = await prisma.task.delete({ where: { id } });
      res.status(200).json(deletedTask);
    } catch (error) {
      next(new ApiError(404, "Task not found or delete failed"));
    }
  }
);

export default router;
