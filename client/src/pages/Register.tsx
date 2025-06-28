import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
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
          <h1 className="text-2xl font-bold">Create your tmgr account</h1>
        </div>

        <div className="flex flex-col">
          <div className="relative">
            <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              id="name"
              type="text"
              placeholder="your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 py-2 px-3 text-base rounded bg-[#202020] border-transparent w-full"
              required
            />
          </div>
        </div>

        <div className="flex flex-col">
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
          disabled={loading || !name || !email || !password}
        >
          {loading ? "Registering..." : "Create Account"}
        </button>

        <div className="flex flex-row place-items-center justify-center gap-x-2">
          <p className="text-slate-500 text-sm">Already have an account?</p>
          <a href="/login" className="text-sm">
            Sign in
          </a>
        </div>
      </form>
    </div>
  );
}
