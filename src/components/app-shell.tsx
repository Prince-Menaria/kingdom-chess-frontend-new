"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, unwrap, type User } from "@/lib/api";
import {
  LayoutDashboard,
  Swords,
  Trophy,
  UserRound,
  LogOut,
  CalendarDays,
} from "lucide-react";
import { useEffect } from "react";

export function useMe() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => unwrap<User>(await apiFetch<any>("/api/v1/auth/me")),
    retry: false,
  });
}

export default function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const path = usePathname();
  const router = useRouter();
  const qc = useQueryClient();
  const me = useMe();
  const user = me.data;
  useEffect(() => {
    if (me.isError) router.replace("/login");
    else if (user && path.startsWith("/coach") && user.role !== "coach")
      router.replace("/student");
    else if (user && path.startsWith("/student") && user.role !== "student")
      router.replace("/coach");
  }, [me.isError, router, user, path]);
  const coach = user?.role === "coach";
  const nav = coach
    ? [
        { label: "Overview", href: "/coach", icon: LayoutDashboard },
        {
          label: "Tournaments",
          href: "/coach/tournaments",
          icon: CalendarDays,
        },
        { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { label: "Profile", href: "/profile", icon: UserRound },
      ]
    : [
        { label: "Overview", href: "/student", icon: LayoutDashboard },
        { label: "Explore tournaments", href: "/tournaments", icon: Swords },
        { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { label: "Profile", href: "/profile", icon: UserRound },
      ];
  async function logout() {
    try {
      await apiFetch("/api/v1/auth/logout", { method: "POST" });
    } finally {
      qc.clear();
      router.replace("/login");
    }
  }
  if (me.isLoading || !user)
    return (
      <div className="empty">
        <div className="spinner" style={{ margin: "0 auto 14px" }} />
        <div className="subtle">Checking your secure session…</div>
      </div>
    );
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Swords size={22} />
          </span>
          <span>
            Kingdom<span style={{ color: "#7868ef" }}>Chess</span>
          </span>
        </Link>
        <div className="nav-label">WORKSPACE</div>
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            path === item.href ||
            (item.href !== "/student" &&
              item.href !== "/coach" &&
              path.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${active ? "active" : ""}`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
        <div className="side-bottom">
          <div
            className="card"
            style={{
              padding: 14,
              margin: "18px 3px 18px",
              background: "linear-gradient(135deg,#f1efff,#fff)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 5 }}>
              Ready for a match?
            </div>
            <div className="subtle" style={{ fontSize: 11, marginBottom: 12 }}>
              Practice makes progress.
            </div>
            <Link
              className="btn btn-secondary"
              href={coach ? "/coach/tournaments" : "/tournaments"}
              style={{ width: "100%", padding: 10, fontSize: 11 }}
            >
              {coach ? "Manage events" : "Find a game"}
            </Link>
          </div>
          <button
            className="nav-link"
            onClick={logout}
            style={{
              width: "100%",
              border: 0,
              background: "transparent",
              textAlign: "left",
            }}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div>
            <div className="topbar-title">Kingdom Chess / {title}</div>
            <div
              style={{
                fontWeight: 800,
                fontFamily: "Manrope",
                fontSize: 16,
                marginTop: 4,
              }}
            >
              {title}
            </div>
          </div>
          <div className="topbar-right">
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>{user.name}</div>
              <div
                style={{
                  fontSize: 10,
                  color: "#8b93a4",
                  textTransform: "capitalize",
                  marginTop: 3,
                }}
              >
                {user.role}
              </div>
            </div>
            <div className="avatar">
              {user.name?.slice(0, 1).toUpperCase() || "K"}
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
