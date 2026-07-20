"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { SITE_LOGO_PATH, SITE_NAME } from "@/constants/site";
import { cn } from "@/lib/utils";

const inputClassName =
  "w-full rounded-btn border border-divider px-4 py-3 text-sm text-body-text transition-colors focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password. Please try again.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-[420px] rounded-card bg-white p-12 shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
        <div className="mb-8 flex justify-center">
          {!logoError ? (
            <Image
              src={SITE_LOGO_PATH}
              alt={`${SITE_NAME} — Kaduna livestock farm logo`}
              width={180}
              height={64}
              className="h-14 w-auto max-w-[180px] object-contain"
              sizes="160px"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="font-display text-2xl font-bold text-navy">
              {SITE_NAME}
            </span>
          )}
        </div>

        <h1 className="text-center font-display text-[28px] font-bold text-navy">
          Admin Login
        </h1>
        <p className="mb-9 mt-2 text-center text-sm font-normal text-muted">
          {SITE_NAME} Management Panel
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-navy"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-navy"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={cn(inputClassName, "pr-12")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-navy"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-btn border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-forest px-6 py-3 font-label text-base font-semibold text-white transition-colors hover:bg-forest/90 disabled:pointer-events-none disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-muted">
          Contact your administrator if you cannot log in.
        </p>
      </div>
    </div>
  );
}
