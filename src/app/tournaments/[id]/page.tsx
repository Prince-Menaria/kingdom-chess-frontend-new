"use client";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { apiFetch, unwrap, type Tournament } from "@/lib/api";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Swords,
  Trophy,
} from "lucide-react";
type QueueResult = {
  status?: string;
  match?: { id: number; status: string };
  message?: string;
};
export default function TournamentDetails() {
  const p = useParams<{ id: string }>();
  const id = Number(p.id);
  const router = useRouter();
  const qc = useQueryClient();
  const [message, setMessage] = useState("");
  const q = useQuery({
    queryKey: ["tournament", id],
    queryFn: async () =>
      unwrap<Tournament>(await apiFetch<any>(`/api/v1/tournaments/${id}`)),
    enabled: Number.isInteger(id) && id > 0,
  });
  const join = useMutation({
    mutationFn: () =>
      apiFetch<any>(`/api/v1/tournaments/${id}/join`, { method: "POST" }),
    onSuccess: () => {
      setMessage("You joined this tournament. You can now find an opponent.");
      qc.invalidateQueries({ queryKey: ["tournaments"] });
    },
    onError: (e) =>
      setMessage(e instanceof Error ? e.message : "Could not join tournament"),
  });
  const find = useMutation({
    mutationFn: () =>
      apiFetch<QueueResult>(`/api/v1/tournaments/${id}/find-opponent`, {
        method: "POST",
      }),
    onSuccess: (r) => {
      if (r.match?.id) router.push(`/match/${r.match.id}`);
      else
        setMessage(
          r.message ||
            "You are in the matchmaking queue. Return here shortly and try again to check for a match.",
        );
    },
    onError: (e) =>
      setMessage(e instanceof Error ? e.message : "Could not find an opponent"),
  });
  const t = q.data;
  return (
    <AppShell title="Tournament details">
      <div className="content">
        <Link
          href="/tournaments"
          className="subtle"
          style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
        >
          <ArrowLeft size={15} /> Back to tournaments
        </Link>
        {q.isLoading ? (
          <div className="empty">
            <div className="spinner" style={{ margin: "auto" }} />
          </div>
        ) : q.isError || !t ? (
          <div className="alert" style={{ marginTop: 20 }}>
            Could not load this tournament.{" "}
            {q.error instanceof Error ? q.error.message : ""}
          </div>
        ) : (
          <>
            <div
              className="card"
              style={{
                marginTop: 22,
                padding: 30,
                background: "linear-gradient(120deg,#fff,#f2efff)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="eyebrow">TOURNAMENT #{t.id}</div>
              <div
                className="row-between"
                style={{ alignItems: "flex-start", marginTop: 8 }}
              >
                <div>
                  <h1 className="h1" style={{ marginTop: 0 }}>
                    {t.name}
                  </h1>
                  <p className="subtle">
                    Enter the competition and meet your next opponent.
                  </p>
                </div>
                <div
                  className="tournament-icon"
                  style={{ width: 58, height: 58 }}
                >
                  <Trophy size={27} />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                  marginTop: 25,
                }}
              >
                <span
                  className="subtle"
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <Clock3 size={15} />
                  {t.timeControl} time control
                </span>
                <span
                  className="subtle"
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <CalendarDays size={15} />
                  {new Date(t.startAt).toLocaleString()}
                </span>
                <span className={`badge badge-${t.status}`}>{t.status}</span>
              </div>
            </div>
            <div
              className="grid-stats"
              style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}
            >
              <div className="stat-card">
                <div className="stat-top">
                  Tournament status
                  <span className="stat-icon">
                    <ShieldCheck size={18} />
                  </span>
                </div>
                <div
                  className="stat-number"
                  style={{ fontSize: 22, textTransform: "capitalize" }}
                >
                  {t.status}
                </div>
                <div className="stat-foot">
                  {t.status === "open"
                    ? "Accepting student registrations"
                    : t.status === "ongoing"
                      ? "Matchmaking is available"
                      : "This event is not currently accepting entries"}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  Game format
                  <span className="stat-icon">
                    <Swords size={18} />
                  </span>
                </div>
                <div className="stat-number" style={{ fontSize: 22 }}>
                  Live chess
                </div>
                <div className="stat-foot">
                  Moves sync with your opponent in real time
                </div>
              </div>
            </div>
            {message && (
              <div
                className={`alert ${message.toLowerCase().includes("joined") ? "success" : ""}`}
              >
                {message}
              </div>
            )}
            <div className="card card-pad">
              <div className="section-title">Ready to play?</div>
              <p className="subtle" style={{ fontSize: 12, marginBottom: 20 }}>
                Join the tournament first. Once registered, find-opponent will
                pair you automatically when another eligible student is waiting.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary"
                  disabled={t.status !== "open" || join.isPending}
                  onClick={() => join.mutate()}
                >
                  {join.isPending ? (
                    "Joining…"
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Join tournament
                    </>
                  )}
                </button>
                <button
                  className="btn btn-secondary"
                  disabled={
                    !["open", "ongoing"].includes(t.status) || find.isPending
                  }
                  onClick={() => find.mutate()}
                >
                  {find.isPending ? (
                    <span className="spinner" />
                  ) : (
                    <>
                      <Swords size={16} /> Find opponent
                    </>
                  )}
                </button>
              </div>
              <p className="footer-note" style={{ marginTop: 17 }}>
                The backend enforces registration, duplicate-join, and
                matchmaking eligibility rules.
              </p>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
