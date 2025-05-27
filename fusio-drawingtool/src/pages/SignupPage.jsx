import { useState } from "react";
import { useSignupMutation } from "../features/auth/authSlice";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup, { isLoading, error }] = useSignupMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup({ fullName, username, email, password }); // send all fields
    if (!res.error) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-purple-400 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-zinc-900 p-6 rounded-md shadow-xl space-y-4"
      >
        <h2 className="text-white text-2xl font-semibold text-center">Sign Up</h2>

        <Input
          placeholder="Full Name"
          type="text"
          className="bg-zinc-800 text-white"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          placeholder="Username"
          type="text"
          className="bg-zinc-800 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          placeholder="Email"
          type="email"
          className="bg-zinc-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          className="bg-zinc-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error.data?.message || "Signup failed"}
          </p>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>

        <p className="text-sm text-center text-zinc-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
