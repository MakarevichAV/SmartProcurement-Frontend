import { useState } from "react";
import type { FormEvent } from "react";

import { useLoginMutation } from "@/api/authApi";

export function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    // On success, authApi triggers /me which flips auth.status → the ProtectedRoute
    // swaps this screen for the app shell. Errors surface as a toast.
    await login({ email, password })
      .unwrap()
      .catch(() => undefined);
  }

  return (
    <div className="mx-auto mt-24 max-w-sm rounded-lg border p-6">
      <h1 className="mb-4 text-lg font-semibold">Sign in to Smart Procurement</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm">
          Email
          <input
            className="mt-1 w-full rounded border px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded border px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-gray-900 py-1.5 text-white disabled:opacity-50"
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
