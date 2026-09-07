import { useState } from "react";
import type { FormEvent } from "react";

import { useLoginMutation } from "@/api/authApi";
import { LogoLockup, LogoMark } from "@/components/brand/Logo";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

const PRINCIPLES = [
  "Autonomy is set per capability, from L0 to L5 — never system-wide.",
  "Every level increase is a human decision. The system can only step itself down.",
  "Each L4 and L5 action is written to an append-only audit record before it counts as done.",
];

export function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError }] = useLoginMutation();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    // On success, authApi triggers /me which flips auth.status → the ProtectedRoute
    // swaps this screen for the app shell. Errors also surface as a toast.
    await login({ email, password })
      .unwrap()
      .catch(() => undefined);
  }

  return (
    <div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel — the one place the design raises its voice. */}
      <aside className="relative hidden overflow-hidden bg-navy p-12 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(120% 80% at 20% 0%, #000 40%, transparent 100%)",
          }}
        />
        <div className="relative">
          <LogoLockup tone="on-navy" />
        </div>
        <div className="relative max-w-md">
          <h2 className="text-[26px] font-semibold leading-tight text-ink-on-navy">
            Procurement automation you can hold to account.
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {PRINCIPLES.map((p) => (
              <li key={p} className="flex gap-3 text-[13px] leading-relaxed text-white/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative font-mono text-[11px] text-white/35">
          For Administrator, Buyer and Approver accounts
        </p>
      </aside>

      {/* Form */}
      <main className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <LogoLockup />
          </div>
          <div className="mb-6 hidden lg:block">
            <LogoMark size={36} />
          </div>

          <h1 className="text-[20px] font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-[13px] text-ink-muted">Use your Smart Procurement account.</p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            {isError ? (
              <Alert tone="danger">
                We couldn&apos;t sign you in. Check your email and password, then try again.
              </Alert>
            ) : null}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <Button type="submit" loading={isLoading} fullWidth className="mt-1">
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-[12.5px] text-ink-subtle">
            Trouble signing in? Contact your administrator.
          </p>
        </div>
      </main>
    </div>
  );
}
