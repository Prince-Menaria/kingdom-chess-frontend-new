"use client";
import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";
import AppShell, { useMe } from "@/components/app-shell";
export default function ProfilePage() {
  const q = useMe();
  const u = q.data;
  return (
    <AppShell title="My profile">
      <div className="content">
        <div className="eyebrow">ACCOUNT SETTINGS</div>
        <h1 className="h1">Your profile</h1>
        <p className="subtle">Your account details and session information.</p>
        {q.isLoading ? (
          <div className="empty">
            <div className="spinner" style={{ margin: "auto" }} />
          </div>
        ) : q.isError || !u ? (
          <div className="alert">
            Could not load profile. Please sign in again.
          </div>
        ) : (
          <div
            className="card"
            style={{ maxWidth: 780, marginTop: 25, overflow: "hidden" }}
          >
            <div
              style={{
                padding: 28,
                background: "linear-gradient(120deg,#f1efff,#fff)",
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <div
                className="avatar"
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 20,
                  fontSize: 25,
                }}
              >
                {u.name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h2
                  className="font-display"
                  style={{ fontSize: 22, margin: "0 0 5px" }}
                >
                  {u.name}
                </h2>
                <div className="subtle" style={{ fontSize: 12 }}>
                  Kingdom Chess member
                </div>
              </div>
              <span className="badge badge-open" style={{ marginLeft: "auto" }}>
                {u.role}
              </span>
            </div>
            <div style={{ padding: 28, display: "grid", gap: 0 }}>
              {[
                { label: "Full name", value: u.name, icon: UserRound },
                { label: "Email address", value: u.email, icon: Mail },
                { label: "Account role", value: u.role, icon: ShieldCheck },
                {
                  label: "Member since",
                  value: u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "Available in profile API",
                  icon: CalendarDays,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "17px 0",
                    borderBottom: "1px solid #f0f1f6",
                  }}
                >
                  <div className="stat-icon">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="subtle" style={{ fontSize: 11 }}>
                      {item.label}
                    </div>
                    <div
                      style={{ fontSize: 13, fontWeight: 800, marginTop: 5 }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "0 28px 26px" }}>
              <div className="footer-note">
                Your login token is stored in an HttpOnly cookie and is not
                readable by frontend JavaScript.
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
