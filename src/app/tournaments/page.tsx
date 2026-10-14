"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarDays, Clock3, Search, Trophy } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { apiFetch, unwrap, type Tournament } from "@/lib/api";
export default function TournamentBrowser() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const q = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () =>
      unwrap<Tournament[]>(await apiFetch<any>("/api/v1/tournaments")),
  });
  const items = Array.isArray(q.data) ? q.data : [];
  const visible = items.filter(
    (t) =>
      ["open", "ongoing"].includes(t.status) &&
      (filter === "all" || t.status === filter) &&
      t.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <AppShell title="Explore tournaments">
      <div className="content">
        <div className="eyebrow">FIND YOUR ARENA</div>
        <h1 className="h1">Explore tournaments</h1>
        <p className="subtle">
          Pick an event, join the field, and get matched with an opponent.
        </p>
        <div
          className="row-between"
          style={{ marginTop: 27, flexWrap: "wrap" }}
        >
          <div
            style={{ position: "relative", flex: "1 1 240px", maxWidth: 400 }}
          >
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 13,
                top: 14,
                color: "#8c95a6",
              }}
            />
            <input
              className="input"
              style={{ paddingLeft: 40 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tournaments…"
            />
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            {[
              ["all", "All events"],
              ["open", "Open"],
              ["ongoing", "Ongoing"],
            ].map(([k, v]) => (
              <button
                key={k}
                className={`btn ${filter === k ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilter(k)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        {q.isLoading ? (
          <div className="empty">
            <div className="spinner" style={{ margin: "auto" }} />
          </div>
        ) : q.isError ? (
          <div className="alert">
            Could not load tournaments.{" "}
            {q.error instanceof Error ? q.error.message : ""}
          </div>
        ) : visible.length === 0 ? (
          <div className="card empty" style={{ marginTop: 22 }}>
            <div className="empty-icon">
              <Trophy size={24} />
            </div>
            <div className="section-title">No matching tournaments</div>
            <p className="subtle">
              Try another search or check back when new events open.
            </p>
          </div>
        ) : (
          <div className="tournament-grid">
            {visible.map((t) => (
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
                  View details →
                </Link>
              </article>
            ))}
          </div>
        )}
        <p className="footer-note" style={{ marginTop: 22 }}>
          Only open and ongoing tournaments are shown to students.
        </p>
      </div>
    </AppShell>
  );
}
