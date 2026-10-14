"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Swords,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await apiFetch("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setSuccess("Account created. Sign in to start playing.");
      setTimeout(() => router.push("/login"), 900);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create account");
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
            MAKE YOUR MOVE
          </div>
          <h1>Find your focus. Find your game.</h1>
          <p>
            Create your account to explore tournaments, join the matchmaking
            queue, and play live chess with other students.
          </p>
        </div>
        <div className="footer-note" style={{ color: "#aaa9ca" }}>
          One board. Endless possibilities.
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
              marginBottom: 32,
            }}
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
          <div className="eyebrow">CREATE ACCOUNT</div>
          <h2 style={{ marginTop: 10 }}>Join the arena</h2>
          <p className="subtle" style={{ marginBottom: 24 }}>
            Start your chess journey today.
          </p>
          {error && <div className="alert">{error}</div>}
          {success && <div className="alert success">{success}</div>}
          <div className="field">
            <label>Full name</label>
            <div style={{ position: "relative" }}>
              <UserRound
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
                required
                minLength={1}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div className="field">
            <label>
              Password{" "}
              <span style={{ color: "#9ba2b1", fontWeight: 500 }}>
                (at least 8 characters)
              </span>
            </label>
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
                minLength={8}
                maxLength={72}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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
            {busy ? <span className="spinner" /> : "Create student account"}
          </button>
          <div className="auth-foot">
            Already registered?{" "}
            <Link href="/login" style={{ color: "#6757e8", fontWeight: 800 }}>
              Sign in
            </Link>
          </div>
          <div
            className="footer-note"
            style={{ textAlign: "center", marginTop: 20 }}
          >
            New registrations are assigned the student role by the backend.
          </div>
        </form>
      </section>
    </div>
  );
}
