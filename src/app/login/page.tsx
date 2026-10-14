"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Swords,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { apiFetch, unwrap, type User } from "@/lib/api";
export default function LoginPage() {
  const router = useRouter(),
    qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await apiFetch("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const response = await apiFetch<any>("/api/v1/auth/me");
      const user = unwrap<User>(response);
      qc.setQueryData(["me"], user);
      router.replace(user.role === "coach" ? "/coach" : "/student");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not log in");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-wrap">
      <section className="auth-art">
        <Link href="/" className="brand" style={{ padding: 0, color: "#fff" }}>
          <span className="brand-mark">
            <Swords size={22} />
          </span>
          Kingdom Chess
        </Link>
        <div className="auth-art-content">
          <div className="eyebrow" style={{ color: "#b9adff" }}>
            YOUR CHESS JOURNEY
          </div>
          <h1>Every great game begins with a single move.</h1>
          <p>
            Sign in to enter your arena, find worthy opponents, and keep growing
            one game at a time.
          </p>
          <div
            style={{
              display: "flex",
              gap: 22,
              marginTop: 28,
              color: "#d7d4f3",
              fontSize: 12,
            }}
          >
            <span>✦ Live matches</span>
            <span>✦ Tournament play</span>
          </div>
        </div>
        <div className="footer-note" style={{ color: "#aaa9ca" }}>
          Built for curious minds and competitive spirits.
        </div>
      </section>
      <section className="auth-form-side">
        <form className="auth-form" onSubmit={submit}>
          <Link
            href="/"
            className="subtle"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12,
              marginBottom: 36,
            }}
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
          <div className="eyebrow">WELCOME BACK</div>
          <h2 style={{ marginTop: 10 }}>Sign in to play</h2>
          <p className="subtle" style={{ marginBottom: 28 }}>
            Your next great game is waiting.
          </p>
          {error && <div className="alert">{error}</div>}
          <div className="field">
            <label>Email address</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: 13,
                  top: 14,
                  color: "#929bad",
                }}
              />
              <input
                className="input"
                style={{ paddingLeft: 40 }}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="field">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <LockKeyhole
                size={16}
                style={{
                  position: "absolute",
                  left: 13,
                  top: 14,
                  color: "#929bad",
                }}
              />
              <input
                className="input"
                style={{ paddingLeft: 40, paddingRight: 42 }}
                type={show ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  border: 0,
                  background: "transparent",
                  color: "#929bad",
                }}
              >
                {show ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={busy}
            style={{ width: "100%", padding: 14, marginTop: 8 }}
          >
            {busy ? <span className="spinner" /> : "Sign in securely"}
          </button>
          <div className="auth-foot">
            New to Kingdom Chess?{" "}
            <Link
              href="/register"
              style={{ color: "#6757e8", fontWeight: 800 }}
            >
              Create an account
            </Link>
          </div>
          <div
            className="footer-note"
            style={{ textAlign: "center", marginTop: 22 }}
          >
            Your session is protected with an HttpOnly cookie.
          </div>
        </form>
      </section>
    </div>
  );
}
