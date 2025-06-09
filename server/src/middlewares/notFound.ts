import { Request, Response, NextFunction } from "express";

const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({ error: "Route not found" });
};

export default notFound;
