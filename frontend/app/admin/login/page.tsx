"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login } from "@/lib/admin/api";
import { Button } from "../_components/Button";
import { Field } from "../_components/Field";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      await login(email, password);
      router.push("/admin/hero");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
      setPending(false);
    }
  };

  return (
    <div className="bg-ink relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12">
      <div aria-hidden className="absolute top-1/2 left-1/2 -z-10 h-80 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7479ff]/15 blur-3xl" />

      <p className="font-display text-xl font-semibold tracking-[-0.02em] text-white">Admin</p>

      <form
        onSubmit={onSubmit}
        className="mt-8 w-full max-w-sm rounded-3xl border border-white/60 bg-white p-8 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)]"
      >
        <h1 className="font-display text-ink text-2xl font-semibold tracking-[-0.02em]">Sign in</h1>
        <p className="mt-1 text-sm text-[#5b6178]">Manage your site content.</p>

        <div className="mt-6 flex flex-col gap-4">
          <Field label="Email" type="email" required autoComplete="email" value={email} onChange={setEmail} />
          <Field label="Password" type="password" required autoComplete="current-password" value={password} onChange={setPassword} />
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-[#fff5f5] px-3 py-2 text-sm font-medium text-[#9b1c1f]">
            {error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-6 w-full">
          {pending && <LoaderCircle className="size-4 animate-spin" />}
          {pending ? "Signing in" : "Sign in"}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
