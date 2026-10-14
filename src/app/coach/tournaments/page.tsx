"use client";
import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Plus, X, Clock3, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { apiFetch, unwrap, type Tournament } from "@/lib/api";
export default function CoachTournaments() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [timeControl, setTimeControl] = useState("5+0");
  const [startAt, setStartAt] = useState("");
  const [error, setError] = useState("");
  const q = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () =>
      unwrap<Tournament[]>(await apiFetch<any>("/api/v1/tournaments")),
  });
  const items = Array.isArray(q.data) ? q.data : [];
  const create = useMutation({
    mutationFn: () =>
      apiFetch("/api/v1/tournaments", {
        method: "POST",
        body: JSON.stringify({
          name,
          timeControl,
          startAt: new Date(startAt).toISOString(),
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tournaments"] });
      setOpen(false);
      setName("");
      setStartAt("");
      setError("");
    },
  });
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await create.mutateAsync();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create tournament");
    }
  }
  return (
    <AppShell title="Tournaments">
      <div className="content">
        <div className="row-between">
          <div>
            <div className="eyebrow">EVENT MANAGEMENT</div>
            <h1 className="h1">Tournaments</h1>
            <p className="subtle">
              Build your next competition, from draft to game day.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> New tournament
          </button>
        </div>
        <div className="grid-stats">
          {[
            { label: "All events", value: items.length },
            {
              label: "Draft",
              value: items.filter((t) => t.status === "draft").length,
            },
            {
              label: "Open",
              value: items.filter((t) => t.status === "open").length,
            },
            {
              label: "Completed",
              value: items.filter((t) => t.status === "completed").length,
            },
          ].map((x, i) => (
            <div className="stat-card" key={x.label}>
              <div className="stat-top">
                {x.label}
                <span className="stat-icon">
                  <CalendarDays size={17} />
                </span>
              </div>
              <div className="stat-number">{q.isLoading ? "—" : x.value}</div>
              <div className="stat-foot">Tournament status</div>
            </div>
          ))}
        </div>
        {q.isError && (
          <div className="alert">
            Could not load tournaments.{" "}
            {q.error instanceof Error ? q.error.message : ""}
          </div>
        )}
        {q.isLoading ? (
          <div className="empty">
            <div className="spinner" style={{ margin: "auto" }} />
          </div>
        ) : items.length === 0 ? (
          <div className="card empty">
            <div className="empty-icon">
              <CalendarDays size={24} />
            </div>
            <div className="section-title">No tournaments yet</div>
            <p className="subtle">
              Create your first event and open registration when you are ready.
            </p>
            <button className="btn btn-primary" onClick={() => setOpen(true)}>
              <Plus size={15} /> Create tournament
            </button>
          </div>
        ) : (
          <div className="tournament-grid">
            {items.map((t) => (
              <article className="card tournament-card" key={t.id}>
                <div className="tournament-icon">
                  <TrophyIcon />
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
                  className="btn btn-ghost"
                  style={{ width: "100%" }}
                  href={`/coach/tournaments/${t.id}`}
                >
                  Manage event <ArrowUpRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        )}
        {open && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 20,
              background: "#171a2e80",
              backdropFilter: "blur(5px)",
              display: "grid",
              placeItems: "center",
              padding: 18,
            }}
          >
            <form
              className="card"
              onSubmit={submit}
              style={{
                width: "min(100%,480px)",
                padding: 28,
                boxShadow: "0 25px 80px #11182730",
              }}
            >
              <div className="row-between">
                <div>
                  <div className="eyebrow">NEW EVENT</div>
                  <h2
                    className="font-display"
                    style={{ fontSize: 24, margin: "8px 0" }}
                  >
                    Create tournament
                  </h2>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setOpen(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <p className="subtle" style={{ fontSize: 12, marginBottom: 22 }}>
                Set the basics now; you can update the status from the event
                page.
              </p>
              {error && <div className="alert">{error}</div>}
              <div className="field">
                <label>Tournament name</label>
                <input
                  className="input"
                  minLength={3}
                  maxLength={150}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Autumn Rapid Cup"
                />
              </div>
              <div className="field">
                <label>Time control</label>
                <select
                  className="input"
                  value={timeControl}
                  onChange={(e) => setTimeControl(e.target.value)}
                >
                  <option value="3+0">Blitz · 3 + 0</option>
                  <option value="5+0">Rapid · 5 + 0</option>
                  <option value="10+0">Rapid · 10 + 0</option>
                  <option value="15+10">Classical · 15 + 10</option>
                </select>
              </div>
              <div className="field">
                <label>Start date and time</label>
                <input
                  className="input"
                  type="datetime-local"
                  required
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                disabled={create.isPending}
                style={{ width: "100%" }}
              >
                {create.isPending ? "Creating…" : "Create tournament"}
              </button>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
function TrophyIcon() {
  return <span style={{ fontSize: 23 }}>♜</span>;
}
