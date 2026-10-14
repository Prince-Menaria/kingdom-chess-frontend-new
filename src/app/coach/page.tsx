"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  CircleDot,
  Plus,
  Trophy,
  Users,
  ArrowUpRight,
  Swords,
} from "lucide-react";
import AppShell from "@/components/app-shell";
import { apiFetch, unwrap, type Tournament } from "@/lib/api";
export default function CoachHome() {
  const q = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () =>
      unwrap<Tournament[]>(await apiFetch<any>("/api/v1/tournaments")),
  });
  const items = Array.isArray(q.data) ? q.data : [];
  return (
    <AppShell title="Coach overview">
      <div className="content">
        <div className="row-between">
          <div>
            <div className="eyebrow">COACH WORKSPACE</div>
            <h1 className="h1">Your arena, at a glance.</h1>
            <p className="subtle">
              Create tournaments and keep your chess community moving.
            </p>
          </div>
          <Link className="btn btn-primary" href="/coach/tournaments">
            <Plus size={16} /> Manage tournaments
          </Link>
        </div>
        <div className="grid-stats">
          {[
            {
              label: "Total tournaments",
              value: q.isLoading ? "—" : items.length,
              icon: Trophy,
              foot: "Across all statuses",
            },
            {
              label: "Open for entries",
              value: q.isLoading
                ? "—"
                : items.filter((t) => t.status === "open").length,
              icon: Users,
              foot: "Accepting students",
            },
            {
              label: "In progress",
              value: q.isLoading
                ? "—"
                : items.filter((t) => t.status === "ongoing").length,
              icon: Swords,
              foot: "Currently active",
            },
            {
              label: "Completed",
              value: q.isLoading
                ? "—"
                : items.filter((t) => t.status === "completed").length,
              icon: CircleDot,
              foot: "Finished events",
            },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-top">
                <span>{s.label}</span>
                <span className="stat-icon">
                  <s.icon size={18} />
                </span>
              </div>
              <div className="stat-number">{s.value}</div>
              <div className="stat-foot">{s.foot}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-pad row-between">
            <div>
              <div className="section-title">Recent tournaments</div>
              <div className="subtle" style={{ fontSize: 12, marginTop: 5 }}>
                Manage event status and visibility.
              </div>
            </div>
            <Link href="/coach/tournaments" className="btn btn-secondary">
              View all <ArrowUpRight size={15} />
            </Link>
          </div>
          {q.isLoading ? (
            <div className="empty">
              <div className="spinner" style={{ margin: "auto" }} />
            </div>
          ) : q.isError ? (
            <div className="alert" style={{ margin: 20 }}>
              Could not load tournaments. Check that the API is running.
            </div>
          ) : items.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                <CalendarDays size={24} />
              </div>
              <div className="section-title">Your first event starts here</div>
              <p className="subtle">
                Create a tournament to invite students to compete.
              </p>
              <Link className="btn btn-primary" href="/coach/tournaments">
                <Plus size={15} /> Create tournament
              </Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tournament</th>
                    <th>Time control</th>
                    <th>Start date</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.slice(0, 6).map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 800 }}>{t.name}</td>
                      <td>{t.timeControl}</td>
                      <td>{new Date(t.startAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${t.status}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/coach/tournaments/${t.id}`}
                          style={{ color: "#6655e8", fontWeight: 800 }}
                        >
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="footer-note" style={{ marginTop: 18 }}>
          Participant statistics and leaderboard require backend endpoints that
          are not present in the supplied API.
        </p>
      </div>
    </AppShell>
  );
}
