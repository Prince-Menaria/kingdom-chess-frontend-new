"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Swords,
  Trophy,
  UserRound,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import { apiFetch, unwrap, type Tournament } from "@/lib/api";
export default function StudentHome() {
  const q = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () =>
      unwrap<Tournament[]>(await apiFetch<any>("/api/v1/tournaments")),
  });
  const items = Array.isArray(q.data) ? q.data : [];
  const available = items.filter((t) => ["open", "ongoing"].includes(t.status));
  return (
    <AppShell title="Student dashboard">
      <div className="content">
        <div className="row-between">
          <div>
            <div className="eyebrow">YOUR CHESS JOURNEY</div>
            <h1 className="h1">Ready for your next move?</h1>
            <p className="subtle">
              Explore tournaments and find your next opponent.
            </p>
          </div>
          <Link href="/tournaments" className="btn btn-primary">
            <Swords size={16} /> Find a match
          </Link>
        </div>
        <div className="grid-stats">
          {[
            {
              label: "Available tournaments",
              value: q.isLoading ? "—" : available.length,
              icon: Trophy,
              foot: "Open or ongoing",
            },
            {
              label: "Open for entries",
              value: q.isLoading
                ? "—"
                : items.filter((t) => t.status === "open").length,
              icon: CalendarDays,
              foot: "Ready to join",
            },
            {
              label: "Your profile",
              value: "Active",
              icon: UserRound,
              foot: "Session secured",
            },
            {
              label: "Play format",
              value: "Live",
              icon: Clock3,
              foot: "Real-time moves",
            },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-top">
                {s.label}
                <span className="stat-icon">
                  <s.icon size={18} />
                </span>
              </div>
              <div
                className="stat-number"
                style={{
                  fontSize: s.value === "Available tournaments" ? 22 : 26,
                }}
              >
                {s.value}
              </div>
              <div className="stat-foot">{s.foot}</div>
            </div>
          ))}
        </div>
        <div className="row-between" style={{ marginBottom: 15 }}>
          <div>
            <div className="section-title">Tournaments for you</div>
            <div className="subtle" style={{ fontSize: 12, marginTop: 4 }}>
              Choose an event to join or find an opponent.
            </div>
          </div>
          <Link
            href="/tournaments"
            className="subtle"
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              fontWeight: 800,
              color: "#6555e8",
            }}
          >
            Explore all <ArrowUpRight size={14} />
          </Link>
        </div>
        {q.isLoading ? (
          <div className="empty">
            <div className="spinner" style={{ margin: "auto" }} />
          </div>
        ) : q.isError ? (
          <div className="alert">
            Could not load tournaments. Check that the API is running.
          </div>
        ) : available.length === 0 ? (
          <div className="card empty">
            <div className="empty-icon">
              <Trophy size={24} />
            </div>
            <div className="section-title">No open tournaments yet</div>
            <p className="subtle">Check back soon for the next event.</p>
          </div>
        ) : (
          <div className="tournament-grid">
            {available.slice(0, 6).map((t) => (
              <article className="card tournament-card" key={t.id}>
                <div className="tournament-icon">
                  <Trophy size={21} />
                </div>
                <div
                  className="row-between"
                  style={{ alignItems: "flex-start" }}
                >
                  <div className="tournament-name">{t.name}</div>
                  <span className={`badge badge-${t.status}`}>{t.status}</span>
                </div>
                <div className="tournament-meta">
                  <span>
                    <Clock3 size={13} />
                    {t.timeControl}
                  </span>
                  <span>
                    <CalendarDays size={13} />
                    {new Date(t.startAt).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  href={`/tournaments/${t.id}`}
                >
                  View tournament <ArrowUpRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        )}
        <div
          className="card card-pad"
          style={{
            marginTop: 24,
            display: "flex",
            gap: 18,
            alignItems: "center",
            background: "linear-gradient(120deg,#f1efff,#fff)",
          }}
        >
          <div
            className="stat-icon"
            style={{ width: 48, height: 48, flexShrink: 0 }}
          >
            <Trophy size={23} />
          </div>
          <div>
            <div className="section-title">Track your progress</div>
            <div className="subtle" style={{ fontSize: 12 }}>
              Leaderboard and match history will be available when their API
              endpoints are added to the backend.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
