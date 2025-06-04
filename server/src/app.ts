import express from "express";
import cors from "cors";
import helmet from "helmet";
import taskRoutes from "./routes/tasks";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);

app.get("/", (_req, res) => {
  res.send("API is running");
});

export default app;
