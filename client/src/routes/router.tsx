import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../auth/PrivateRoute";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { TaskProvider } from "../tasks/TaskProvider";

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <TaskProvider>
              <Home />
            </TaskProvider>
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
