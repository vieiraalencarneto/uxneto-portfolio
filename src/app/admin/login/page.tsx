"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLockout = useCallback(() => {
    setLocked(true);
    setCountdown(300);
    timerRef.current = setInterval(() => {
      setCountdown((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setLocked(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
        if (data.locked) startLockout();
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const mins = Math.floor(countdown / 60)
    .toString()
    .padStart(2, "0");
  const secs = (countdown % 60).toString().padStart(2, "0");

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <LogoMark className="h-12 w-auto text-[var(--foreground)]" />
        </div>

        <h1 className="font-serif text-2xl text-[var(--foreground)] text-center mb-1">Admin</h1>
        <p className="text-[var(--muted)] text-sm text-center mb-8">Portfolio management</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted)] mb-1.5"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={locked || loading}
              className="w-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors disabled:opacity-50"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted)] mb-1.5"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={locked || loading}
              className="w-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--foreground)] transition-colors disabled:opacity-50"
            />
          </div>

          {error && (
            <p className="text-xs text-[var(--ember-red)] border border-[var(--ember-red)]/30 bg-[var(--ember-red)]/5 px-3 py-2">
              {error}
            </p>
          )}

          {locked && (
            <p className="text-xs text-[var(--muted)] border border-[var(--border)] px-3 py-2 text-center">
              Access locked. Try again in{" "}
              <span className="font-mono font-semibold text-[var(--foreground)]">
                {mins}:{secs}
              </span>
            </p>
          )}

          <button
            type="submit"
            disabled={locked || loading}
            className="mt-2 bg-[var(--foreground)] text-[var(--background)] py-2.5 text-sm font-semibold tracking-wide hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
