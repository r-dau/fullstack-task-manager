import { createContext } from "react";
import type { User } from "../types/User";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
} | null;

export const AuthContext = createContext<AuthContextType>(null);
