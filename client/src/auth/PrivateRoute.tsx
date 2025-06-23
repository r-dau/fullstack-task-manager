import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
};

export default function PrivateRoute({ children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
