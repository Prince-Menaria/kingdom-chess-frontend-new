"use client";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import AppShell from "@/components/app-shell";
import { apiFetch, unwrap, type Tournament } from "@/lib/api";
import { ArrowLeft, CalendarDays, Clock3, ShieldCheck } from "lucide-react";
export default function ManageTournament() {
  const p = useParams<{ id: string }>();
  const id = Number(p.id);
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["tournament", id],
    queryFn: async () =>
      unwrap<Tournament>(await apiFetch<any>(`/api/v1/tournaments/${id}`)),
    enabled: Number.isInteger(id) && id > 0,
  });
  const change = useMutation({
    mutationFn: (status: string) =>
      apiFetch(`/api/v1/tournaments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tournament", id] });
      qc.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
  const t = q.data;
  return (
    <AppShell title="Manage tournament">
      <div className="content">
        <Link
          href="/coach/tournaments"
          className="subtle"
          style={{ display: "inline-flex", gap: 7, alignItems: "center" }}
        >
          <ArrowLeft size={15} /> All tournaments
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
            <div className="row-between" style={{ marginTop: 24 }}>
              <div>
                <div className="eyebrow">TOURNAMENT DETAILS</div>
                <h1 className="h1">{t.name}</h1>
                <p className="subtle">
                  Manage event visibility and its current status.
                </p>
              </div>
              <span className={`badge badge-${t.status}`}>{t.status}</span>
            </div>
            <div className="grid-stats">
              <div className="stat-card">
                <div className="stat-top">
                  Time control{" "}
                  <span className="stat-icon">
                    <Clock3 size={18} />
                  </span>
                </div>
                <div className="stat-number">{t.timeControl}</div>
                <div className="stat-foot">Minutes + increment</div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  Start date{" "}
                  <span className="stat-icon">
                    <CalendarDays size={18} />
                  </span>
                </div>
                <div className="stat-number" style={{ fontSize: 19 }}>
                  {new Date(t.startAt).toLocaleDateString()}
                </div>
                <div className="stat-foot">
                  {new Date(t.startAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-top">
                  Tournament ID{" "}
                  <span className="stat-icon">
                    <ShieldCheck size={18} />
                  </span>
                </div>
                <div className="stat-number">#{t.id}</div>
                <div className="stat-foot">Unique event identifier</div>
              </div>
            </div>
            <div className="card card-pad">
              <div className="section-title">Update status</div>
              <p className="subtle" style={{ fontSize: 12, marginBottom: 22 }}>
                Draft tournaments are not open for student registration. Open an
                event to accept entries, or mark it ongoing when play begins.
              </p>
              {change.isError && (
                <div className="alert">
                  {change.error instanceof Error
                    ? change.error.message
                    : "Could not update status"}
                </div>
              )}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {(["draft", "open", "ongoing", "completed"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      className={`btn ${t.status === status ? "btn-primary" : "btn-ghost"}`}
                      disabled={change.isPending || t.status === status}
                      onClick={() => change.mutate(status)}
                    >
                      {status[0].toUpperCase() + status.slice(1)}
                    </button>
                  ),
                )}
              </div>
              <p className="footer-note" style={{ marginTop: 18 }}>
                The backend is the source of truth for which status transitions
                are accepted.
              </p>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
