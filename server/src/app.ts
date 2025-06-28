import express from "express";
import cors from "cors";
import helmet from "helmet";
import taskRoutes from "./routes/tasks";
import errorHandler from "./middlewares/errorHandler";
import notFound from "./middlewares/notFound";
import authRoutes from "./auth/auth.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use(notFound);
app.use(errorHandler);

export default app;
