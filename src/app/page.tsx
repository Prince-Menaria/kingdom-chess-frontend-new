import Link from "next/link";
import {
  ArrowRight,
  Swords,
  ShieldCheck,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px clamp(20px,6vw,90px)",
        background: "linear-gradient(120deg,#fafaff,#f0edff 72%,#fff)",
      }}
    >
      <nav
        className="row-between"
        style={{ maxWidth: 1280, margin: "0 auto", height: 55 }}
      >
        <Link href="/" className="brand" style={{ padding: 0 }}>
          <span className="brand-mark">
            <Swords size={22} />
          </span>
          Kingdom<span style={{ color: "#7868ef", marginLeft: -9 }}>Chess</span>
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/login" className="btn btn-ghost">
            Log in
          </Link>
          <Link href="/register" className="btn btn-primary">
            Get started <ArrowRight size={15} />
          </Link>
        </div>
      </nav>
      <section
        style={{
          maxWidth: 1280,
          margin: "75px auto 0",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(300px,.9fr)",
          gap: 50,
          alignItems: "center",
        }}
      >
        <div>
          <div
            className="eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#e9e5ff",
              padding: "9px 12px",
              borderRadius: 99,
            }}
          >
            <Zap size={13} /> YOUR NEXT MOVE STARTS HERE
          </div>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(42px,6vw,76px)",
              lineHeight: 1.04,
              letterSpacing: "-3px",
              margin: "25px 0 20px",
              fontWeight: 800,
            }}
          >
            Think sharp.
            <br />
            <span style={{ color: "#6c5ce7" }}>Play bold.</span>
            <br />
            Rise together.
          </h1>
          <p className="subtle" style={{ fontSize: 16, maxWidth: 470 }}>
            A focused home for chess tournaments, fair matchmaking, and live
            games. Find your opponent and make every move count.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 30,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/register"
              className="btn btn-primary"
              style={{ padding: "15px 20px" }}
            >
              Create free account <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="btn btn-ghost"
              style={{ padding: "15px 20px" }}
            >
              I have an account
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              gap: 25,
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            {[
              ["Fair play", "ShieldCheck"],
              ["Live matches", "Zap"],
              ["Tournaments", "Trophy"],
            ].map(([label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#657086",
                }}
              >
                <span style={{ color: "#6b5ce7" }}>✦</span>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "relative",
            minHeight: 450,
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "85%",
              aspectRatio: 1,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#e4dfff,#f6f2ff)",
              filter: "blur(1px)",
            }}
          />
          <div
            className="card"
            style={{
              position: "relative",
              padding: 17,
              width: "min(100%,430px)",
              transform: "rotate(2deg)",
              boxShadow: "0 28px 70px #3a2a7930",
            }}
          >
            <div className="row-between" style={{ padding: "5px 5px 15px" }}>
              <div>
                <div style={{ fontWeight: 800, fontFamily: "Manrope" }}>
                  Featured match
                </div>
                <div className="subtle" style={{ fontSize: 11 }}>
                  Rapid · 5 + 0
                </div>
              </div>
              <span className="badge badge-ongoing">Live arena</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8,1fr)",
                borderRadius: 8,
                overflow: "hidden",
                border: "4px solid #272440",
              }}
            >
              {Array.from({ length: 64 }, (_, i) => {
                const r = Math.floor(i / 8),
                  c = i % 8;
                const pieces: Record<number, string> = {
                  0: "♜",
                  1: "♞",
                  2: "♝",
                  3: "♛",
                  4: "♚",
                  5: "♝",
                  6: "♞",
                  7: "♜",
                  8: "♟",
                  9: "♟",
                  10: "♟",
                  11: "♟",
                  12: "♟",
                  13: "♟",
                  14: "♟",
                  15: "♟",
                  48: "♙",
                  49: "♙",
                  50: "♙",
                  51: "♙",
                  52: "♙",
                  53: "♙",
                  54: "♙",
                  55: "♙",
                  56: "♖",
                  57: "♘",
                  58: "♗",
                  59: "♕",
                  60: "♔",
                  61: "♗",
                  62: "♘",
                  63: "♖",
                };
                return (
                  <div
                    key={i}
                    style={{
                      aspectRatio: 1,
                      display: "grid",
                      placeItems: "center",
                      background: (r + c) % 2 ? "#8e9f8b" : "#f2e8d8",
                      fontSize: "clamp(18px,2.5vw,30px)",
                      color: i < 16 ? "#27263a" : "#fff",
                      textShadow:
                        i < 16 ? "0 1px 1px white" : "1px 2px 2px #222",
                    }}
                  >
                    {pieces[i] || ""}
                  </div>
                );
              })}
            </div>
            <div className="row-between" style={{ padding: "15px 4px 3px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div className="avatar">A</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800 }}>
                    Alex Morgan
                  </div>
                  <div className="subtle" style={{ fontSize: 10 }}>
                    Rating 1840
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#6c5ce7" }}>
                VS
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      textAlign: "right",
                    }}
                  >
                    You
                  </div>
                  <div className="subtle" style={{ fontSize: 10 }}>
                    Ready to play
                  </div>
                </div>
                <div
                  className="avatar"
                  style={{ background: "#dff6eb", color: "#15805e" }}
                >
                  Y
                </div>
              </div>
            </div>
          </div>
          <div
            className="card"
            style={{
              position: "absolute",
              bottom: 12,
              left: 0,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 14px 30px #252b4212",
            }}
          >
            <div className="stat-icon">
              <Users size={18} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800 }}>
                Find your next rival
              </div>
              <div className="subtle" style={{ fontSize: 10 }}>
                Join an open tournament
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{
          maxWidth: 1280,
          margin: "75px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
        }}
      >
        {[
          {
            icon: Trophy,
            title: "Compete in tournaments",
            text: "Explore events and enter tournaments open to students.",
          },
          {
            icon: Users,
            title: "Fair matchmaking",
            text: "Join a queue and get paired with another eligible player.",
          },
          {
            icon: Zap,
            title: "Live chess",
            text: "Play moves in real time and follow the game position as it updates.",
          },
        ].map(({ icon: Icon, title, text }) => (
          <div className="card card-pad" key={title}>
            <div className="stat-icon">
              <Icon size={20} />
            </div>
            <h3
              className="font-display"
              style={{ fontSize: 17, margin: "18px 0 8px" }}
            >
              {title}
            </h3>
            <p className="subtle" style={{ fontSize: 12, margin: 0 }}>
              {text}
            </p>
          </div>
        ))}
      </section>
      <footer
        style={{
          maxWidth: 1280,
          margin: "50px auto 0",
          padding: "24px 0",
          borderTop: "1px solid #e5e7ef",
          color: "#939aab",
          fontSize: 11,
        }}
      >
        © {new Date().getFullYear()} Kingdom Chess · Play thoughtfully.
      </footer>
    </main>
  );
}
