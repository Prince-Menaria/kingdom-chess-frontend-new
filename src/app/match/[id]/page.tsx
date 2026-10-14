"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Chess, type Square } from "chess.js";
import {
  ArrowLeft,
  CheckCircle2,
  CircleHelp,
  Copy,
  Flag,
  Radio,
  RotateCcw,
  Swords,
} from "lucide-react";
import Link from "next/link";
import AppShell, { useMe } from "@/components/app-shell";
import { API_URL, apiFetch, unwrap, type Match } from "@/lib/api";
const glyph: Record<string, string> = {
  wk: "♔",
  wq: "♕",
  wr: "♖",
  wb: "♗",
  wn: "♘",
  wp: "♙",
  bk: "♚",
  bq: "♛",
  br: "♜",
  bb: "♝",
  bn: "♞",
  bp: "♟",
};
function MatchContent() {
  const params = useParams<{ id: string }>();
  const matchId = Number(params.id);
  const router = useRouter();
  const me = useMe();
  const socketRef = useRef<Socket | null>(null);
  const [fen, setFen] = useState("start");
  const [pgn, setPgn] = useState("");
  const [status, setStatus] = useState("connecting");
  const [result, setResult] = useState<string | null>(null);
  const [whitePlayerId, setWhitePlayerId] = useState<number | null>(null);
  const [blackPlayerId, setBlackPlayerId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [moves, setMoves] = useState<
    Array<{ san: string; color: string; from: string; to: string }>
  >([]);
  const [copyState, setCopyState] = useState(false);
  const game = useMemo(() => {
    try {
      return new Chess(fen === "start" ? undefined : fen);
    } catch {
      return new Chess();
    }
  }, [fen]);
  const userId = me.data?.id;
  useEffect(() => {
    if (!Number.isInteger(matchId) || matchId < 1) return;
    let alive = true;
    const socket = io(API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;
    socket.on("connect", () => {
      if (alive) {
        setStatus("connected");
        socket.emit("join_match", { matchId }, (ack: any) => {
          if (ack?.error) setError(ack.error.message || "Unable to join match");
        });
      }
    });
    socket.on("connect_error", () => {
      if (alive) {
        setStatus("disconnected");
        setError(
          "Could not connect to the live game. Check that you are signed in and the API is running.",
        );
      }
    });
    socket.on("disconnect", () => alive && setStatus("disconnected"));
    socket.on("match_state", (data: any) => {
      if (!alive) return;
      if (data.matchId !== matchId) return;
      setFen(data.fen || "start");
      setPgn(data.pgn || "");
      setResult(data.result || null);
      setWhitePlayerId(data.whitePlayerId ?? null);
      setBlackPlayerId(data.blackPlayerId ?? null);
      setStatus(data.status === "completed" ? "completed" : "connected");
      setError("");
      try {
        const c = new Chess(data.fen || undefined);
        setMoves(
          c
            .history({ verbose: true })
            .map((m) => ({
              san: m.san,
              color: m.color,
              from: m.from,
              to: m.to,
            })),
        );
      } catch {
        setMoves([]);
      }
    });
    socket.on("move_made", (data: any) => {
      if (!alive || data.matchId !== matchId) return;
      setFen(data.fen);
      setPgn(data.pgn || "");
      setLastMove([data.move?.from, data.move?.to]);
      setSelected(null);
      setError("");
      try {
        const c = new Chess(data.fen);
        setMoves(
          c
            .history({ verbose: true })
            .map((m) => ({
              san: m.san,
              color: m.color,
              from: m.from,
              to: m.to,
            })),
        );
      } catch {}
    });
    socket.on("game_over", (data: any) => {
      if (!alive || data.matchId !== matchId) return;
      setFen(data.fen);
      setPgn(data.pgn || "");
      setResult(data.result);
      setStatus("completed");
      setSelected(null);
    });
    socket.on("exception", (e: any) => {
      if (alive)
        setError(
          typeof e?.message === "string"
            ? e.message
            : "Move could not be played",
        );
    });
    return () => {
      alive = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [matchId]);
  const board = game.board();
  const isBlackPlayer =
    me.data?.id !== undefined && blackPlayerId === me.data.id;
  const topPlayer = isBlackPlayer ? "White player" : "Black player";
  const bottomPlayer = isBlackPlayer ? "You · Black" : "You · White";
  const renderedBoard = isBlackPlayer
    ? [...board].reverse().map((row) => [...row].reverse())
    : board;
  function squareClick(sq: Square) {
    if (status !== "connected" || result) return;
    const piece = game.get(sq);
    if (!selected) {
      if (piece) {
        setSelected(sq);
      }
      return;
    }
    if (selected === sq) {
      setSelected(null);
      return;
    }
    const from = selected;
    setSelected(null);
    setError("");
    socketRef.current?.emit(
      "make_move",
      { matchId, from, to: sq, promotion: "q" },
      (ack: any) => {
        if (ack?.error) setError(ack.error.message || "Move rejected");
      },
    );
  }
  async function copyPgn() {
    if (!pgn) return;
    try {
      await navigator.clipboard.writeText(pgn);
      setCopyState(true);
      setTimeout(() => setCopyState(false), 1400);
    } catch {
      setError("Clipboard access was blocked by the browser");
    }
  }
  const movePairs = [] as Array<{ n: number; w?: string; b?: string }>;
  moves.forEach((m, i) => {
    const n = Math.floor(i / 2) + 1;
    if (!movePairs[Math.floor(i / 2)]) movePairs.push({ n });
    if (m.color === "w") movePairs[Math.floor(i / 2)].w = m.san;
    else movePairs[Math.floor(i / 2)].b = m.san;
  });
  return (
    <AppShell title="Live match">
      <div className="content">
        <div className="row-between" style={{ marginBottom: 23 }}>
          <div>
            <Link
              href="/student"
              className="subtle"
              style={{
                display: "inline-flex",
                gap: 7,
                alignItems: "center",
                fontSize: 12,
              }}
            >
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 className="h1" style={{ fontSize: 30, marginBottom: 4 }}>
              Live arena
            </h1>
            <div className="subtle" style={{ fontSize: 12 }}>
              Match #{matchId} · moves sync live between players
            </div>
          </div>
          <span
            className={`badge ${status === "connected" ? "badge-open" : "badge-ongoing"}`}
          >
            <Radio size={12} />
            {status}
          </span>
        </div>
        {error && <div className="alert">{error}</div>}
        <div className="board-layout">
          <section>
            <div className="player-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="avatar">B</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800 }}>
                    {topPlayer}
                  </div>
                  <div className="subtle" style={{ fontSize: 10 }}>
                    Opponent
                  </div>
                </div>
              </div>
              <div className={`clock ${game.turn() === "b" ? "active" : ""}`}>
                —:—
              </div>
            </div>
            <div className="board" role="grid" aria-label="Chess board">
              {renderedBoard.map((row, r) =>
                row.map((piece, c) => {
                  const actualR = isBlackPlayer ? 7 - r : r;
                  const actualC = isBlackPlayer ? 7 - c : c;
                  const sq =
                    `${String.fromCharCode(97 + actualC)}${8 - actualR}` as Square;
                  const dark = (actualR + actualC) % 2 === 1;
                  const selectedHere = selected === sq;
                  const isLast = lastMove?.includes(sq);
                  return (
                    <button
                      key={sq}
                      type="button"
                      aria-label={`${sq}${piece ? ` ${piece.color === "w" ? "white" : "black"} ${piece.type}` : ""}`}
                      className={`square ${dark ? "dark-square" : "light-square"} ${selectedHere ? "selected" : ""} ${isLast ? "last-move" : ""}`}
                      onClick={() => squareClick(sq)}
                    >
                      {piece ? (
                        <span
                          className={
                            piece.color === "w" ? "piece-white" : "piece-black"
                          }
                        >
                          {glyph[piece.color + piece.type]}
                        </span>
                      ) : selected &&
                        game
                          .moves({ square: selected, verbose: true })
                          .some((m) => m.to === sq) ? (
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 99,
                            background: "#27332980",
                          }}
                        />
                      ) : null}
                    </button>
                  );
                }),
              )}
            </div>
            <div className="player-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  className="avatar"
                  style={{ background: "#e1f7eb", color: "#167c5c" }}
                >
                  {me.data?.name?.slice(0, 1).toUpperCase() || "Y"}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800 }}>
                    {isBlackPlayer ? "You" : me.data?.name || "You"}
                  </div>
                  <div className="subtle" style={{ fontSize: 10 }}>
                    {bottomPlayer} ·{" "}
                    {game.turn() === "w" ? "White to move" : "Black to move"}
                  </div>
                </div>
              </div>
              <div className={`clock ${game.turn() === "w" ? "active" : ""}`}>
                —:—
              </div>
            </div>
            <div className="footer-note" style={{ marginTop: 12 }}>
              Click a piece, then its destination square. Illegal moves are
              rejected by the backend. The supplied API does not yet provide a
              server-authoritative clock.
            </div>
          </section>
          <aside style={{ display: "grid", gap: 16 }}>
            <div className="card card-pad">
              <div className="row-between">
                <div className="section-title">Game status</div>
                <span
                  className={`badge ${result ? "badge-completed" : "badge-open"}`}
                >
                  {result ? "Finished" : "In progress"}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "Manrope",
                  fontWeight: 800,
                  fontSize: 22,
                  margin: "17px 0 7px",
                }}
              >
                {result
                  ? result.replace("_", " ")
                  : game.isCheck()
                    ? "Check!"
                    : game.turn() === "w"
                      ? "White to move"
                      : "Black to move"}
              </div>
              <div className="subtle" style={{ fontSize: 12 }}>
                {result
                  ? "This game has ended."
                  : game.isCheck()
                    ? "The current king is in check."
                    : "Play your move when it is your turn."}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 18,
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn btn-ghost"
                  disabled={!pgn}
                  onClick={copyPgn}
                >
                  <Copy size={14} />
                  {copyState ? "Copied" : "Copy PGN"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setFen("start");
                    setPgn("");
                    setMoves([]);
                    setSelected(null);
                    setLastMove(null);
                    setResult(null);
                    setError("");
                    socketRef.current?.emit("join_match", { matchId });
                  }}
                >
                  <RotateCcw size={14} /> Sync board
                </button>
              </div>
            </div>
            <div className="card card-pad">
              <div className="row-between">
                <div className="section-title">Move history</div>
                <span className="subtle" style={{ fontSize: 11 }}>
                  {moves.length} plies
                </span>
              </div>
              <div className="move-list" style={{ marginTop: 12 }}>
                {movePairs.length === 0 ? (
                  <div
                    style={{
                      padding: "20px 5px",
                      textAlign: "center",
                      color: "#929bad",
                    }}
                  >
                    Moves will appear here.
                  </div>
                ) : (
                  movePairs.map((m) => (
                    <div className="move-row" key={m.n}>
                      <span>{m.n}.</span>
                      <span>{m.w || ""}</span>
                      <span>{m.b || ""}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="card card-pad" style={{ background: "#fbfaff" }}>
              <div
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
              >
                <CircleHelp size={18} color="#6b5ce7" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 12 }}>
                    Need to know
                  </div>
                  <p
                    className="subtle"
                    style={{ fontSize: 11, margin: "6px 0 0" }}
                  >
                    The current backend supports live moves and automatic
                    game-over results from chess rules. Resign, draw offers,
                    timeout, and shared clocks need additional backend events.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
export default function MatchPage() {
  return (
    <Suspense
      fallback={
        <div className="empty">
          <div className="spinner" style={{ margin: "auto" }} />
        </div>
      }
    >
      <MatchContent />
    </Suspense>
  );
}
