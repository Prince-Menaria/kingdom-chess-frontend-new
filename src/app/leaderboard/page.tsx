"use client";

import { useEffect, useState } from "react";
import { Trophy, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

type LeaderboardEntry = {
  userId?: number;
  playerId?: number;
  name?: string;
  playerName?: string;
  points?: number | string;
  wins?: number;
  losses?: number;
  draws?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [tournamentId, setTournamentId] = useState("");
  const [tournamentInput, setTournamentInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLeaderboard(id = tournamentId) {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (id.trim()) {
        params.set("tournamentId", id.trim());
      }

      const query = params.toString();
      const response = await fetch(
        `${API_URL}/api/v1/leaderboard${query ? `?${query}` : ""}`,
        { credentials: "include", cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error(`Leaderboard request failed (${response.status})`);
      }

      const data = await response.json();

      // Support either a direct array or { data: [...] } response.
      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : null;

      if (!rows) {
        throw new Error(
          "Unexpected API response. Check the leaderboard response format.",
        );
      }

      setEntries(rows);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load leaderboard",
      );
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLeaderboard("");
    // Initial fetch only. Filtering is handled by the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyFilter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = tournamentInput.trim();
    setTournamentId(id);
    void loadLeaderboard(id);
  }

  return (
    <main className="content" style={{ maxWidth: 900, paddingTop: 55 }}>
      <Link
        href="/"
        className="subtle"
        style={{ display: "inline-flex", gap: 7, alignItems: "center" }}
      >
        <ArrowLeft size={15} /> Home
      </Link>

      <section className="card card-pad" style={{ marginTop: 28 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Trophy size={28} color="#6757e8" />
          <div>
            <div className="eyebrow">LEADERBOARD</div>
            <h1 className="h1" style={{ fontSize: 30, margin: 0 }}>
              Every win deserves a place.
            </h1>
          </div>
        </div>

        <form
          onSubmit={applyFilter}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 24,
          }}
        >
          <input
            type="number"
            min="1"
            value={tournamentInput}
            onChange={(event) => setTournamentInput(event.target.value)}
            placeholder="Tournament ID (optional)"
            aria-label="Tournament ID"
            style={{
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 8,
              flex: "1 1 220px",
            }}
          />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            Apply filter
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => {
              setTournamentInput("");
              setTournamentId("");
              void loadLeaderboard("");
            }}
            disabled={loading}
          >
            All tournaments
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => void loadLeaderboard()}
            disabled={loading}
            aria-label="Refresh leaderboard"
          >
            <RefreshCw size={16} />
          </button>
        </form>

        {loading ? (
          <p className="subtle" role="status" style={{ marginTop: 24 }}>
            Loading leaderboard...
          </p>
        ) : error ? (
          <div role="alert" style={{ marginTop: 24 }}>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => void loadLeaderboard()}
            >
              Try again
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="empty" style={{ marginTop: 24 }}>
            <Trophy size={24} />
            <h2>No leaderboard entries yet</h2>
            <p className="subtle">
              Rankings will appear here when the API returns player results.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto", marginTop: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ padding: 12 }}>Rank</th>
                  <th style={{ padding: 12 }}>Player</th>
                  <th style={{ padding: 12 }}>Points</th>
                  <th style={{ padding: 12 }}>Wins</th>
                  <th style={{ padding: 12 }}>Draws</th>
                  <th style={{ padding: 12 }}>Losses</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr
                    key={entry.userId ?? entry.playerId ?? index}
                    style={{ borderTop: "1px solid #eee" }}
                  >
                    <td style={{ padding: 12 }}>{index + 1}</td>
                    <td style={{ padding: 12 }}>
                      {entry.name ?? entry.playerName ?? "Unknown player"}
                    </td>
                    <td style={{ padding: 12 }}>{entry.points ?? 0}</td>
                    <td style={{ padding: 12 }}>{entry.wins ?? 0}</td>
                    <td style={{ padding: 12 }}>{entry.draws ?? 0}</td>
                    <td style={{ padding: 12 }}>{entry.losses ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
