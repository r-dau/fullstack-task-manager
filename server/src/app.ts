import express from "express";
import cors from "cors";
import helmet from "helmet";
import taskRoutes from "./routes/tasks";
import errorHandler from "./middleware/errorHandler";
import notFound from "./middleware/notFound";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use(notFound);
app.use(errorHandler);

export default app;
