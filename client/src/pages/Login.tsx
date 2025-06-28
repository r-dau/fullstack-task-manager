import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your login details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md min-w-[430px] p-8 bg-[#262626] rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="mx-auto space-y-4">
        <div className="place-items-center gap-x-4">
          <div className="p-2 bg-[#242424] rounded-xl shadow-xl">
            <img
              src="./src/assets/tmgr_white_logo_large.svg"
              alt="tmgr Logo"
              className="justify-center h-12 mb-4"
            />
          </div>
          <h1 className="text-2xl font-bold">Sign in to tmgr</h1>
        </div>

        <div className="flex flex-col">
          {/* <label htmlFor="email" className="mb-1">
            Email address
          </label> */}
          <div className="relative">
            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              id="email"
              type="email"
              placeholder="email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 py-2 px-3 text-base rounded bg-[#202020] border-transparent w-full"
              required
            />
          </div>
        </div>

        <div className="flex flex-col">
          {/* <label htmlFor="password" className="mb-1">
            Passwort
          </label> */}
          <div className="relative">
            <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 py-2 px-3 text-base rounded bg-[#202020] border-transparent w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="btn-reset absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 bg-[#202020] hover:cursor-pointer hover:border-none focus:outline-none border-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#007FFF] text-white py-2 rounded disabled:opacity-50"
          disabled={loading || !email || !password}
        >
          {loading ? "Einloggen..." : "Einloggen"}
        </button>
        <div className="flex flex-row place-items-center justify-center gap-x-2">
          <p className="text-gray-400 text-sm">New to tmgr?</p>
          <a href="/register" className="text-sm underlined">
            Create Account
          </a>
        </div>
      </form>
    </div>
  );
}
