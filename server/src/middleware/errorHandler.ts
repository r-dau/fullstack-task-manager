import { Response, NextFunction } from "express";
import ApiError from "../errors/ApiError";

const errorHandler = (err: any, res: Response, _next: NextFunction): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;
