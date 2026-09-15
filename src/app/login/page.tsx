"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Try admin@aegis.com / admin");
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-surface-container border border-primary/40 shadow-[0_0_15px_-2px_rgba(6,182,212,0.4)] mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              shield
            </span>
          </div>
          <h1 className="text-headline-md font-headline-md font-bold text-on-surface">
            Aegis Command Center
          </h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Sign in to access the SOC dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-error-container/20 border border-error/50 text-error text-body-sm font-semibold">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-telemetry-sm font-label-caps text-on-surface-variant mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-colors"
              placeholder="admin@aegis.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-telemetry-sm font-label-caps text-on-surface-variant mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 relative group overflow-hidden rounded-lg p-px font-headline-sm text-body-md font-semibold text-background transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container group-hover:opacity-90"></span>
            <span className="relative flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-b from-primary to-[#0891b2] rounded-lg text-surface-container-lowest font-bold">
              {isLoading ? "Authenticating..." : "Initialize Session"}
            </span>
          </button>
        </form>
        <div className="mt-6 text-center">
            <p className="text-telemetry-sm text-on-surface-variant">
              Test Accounts:<br/>
              admin@aegis.com / admin<br/>
              john.l1@aegis.com / password
            </p>
        </div>
      </div>
    </div>
  );
}
