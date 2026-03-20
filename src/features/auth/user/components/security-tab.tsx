"use client";

import { useState } from "react";
import {
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
  GlobeIcon,
  ShieldIcon,
  LogOutIcon,
  WifiIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserData } from "../hooks/use-userData";
import { timeAgo, parseUserAgent } from "../lib/helpers";
import { toast } from "sonner";

function DeviceIcon({ type }: { type: "desktop" | "mobile" | "tablet" }) {
  const cls = "h-4 w-4";
  if (type === "mobile") return <SmartphoneIcon className={cls} />;
  if (type === "tablet") return <TabletIcon className={cls} />;
  return <MonitorIcon className={cls} />;
}

function SecuritySkeleton() {
  return (
    <div className="px-4 sm:px-5 py-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30">
        <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-28 rounded bg-muted" />
          <div className="h-3 w-36 rounded bg-muted" />
        </div>
      </div>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-xl border border-border"
        >
          <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-40 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SecurityTab() {
  const {
    sessions,
    isLoadingSessions,
    revokeSession,
    isRevoking,
    currentSessionToken,
  } = useUserData();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      await revokeSession({ sessionId });
      toast.success("Session revoked");
    } catch {
      toast.error("Failed to revoke session");
    } finally {
      setRevokingId(null);
    }
  };

  if (isLoadingSessions) return <SecuritySkeleton />;

  const now = new Date();
  const activeSessions = sessions
    .filter((s) => new Date(s.expiresAt) > now)
    .sort((a, b) => {
      if (a.token === currentSessionToken) return -1;
      if (b.token === currentSessionToken) return 1;
      return 0;
    });
  const expiredCount = sessions.length - activeSessions.length;

  return (
    <div className="flex flex-col px-4 sm:px-5 py-4 gap-3">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-accent border">
        <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
          <ShieldIcon className="h-4 w-4 text-amber-900" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {activeSessions.length} active session
            {activeSessions.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            Across all your devices
          </p>
        </div>
      </div>

      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
        Devices & sessions
      </p>

      {activeSessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
            <MonitorIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No active sessions</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            You&apos;ll see active devices here
          </p>
        </div>
      )}

      <div className="space-y-2">
        {activeSessions.map((session) => {
          const { device, browser, os, icon } = parseUserAgent(
            session.userAgent,
          );
          const isCurrent = session.token === currentSessionToken;
          const isBeingRevoked = revokingId === session.id;

          return (
            <div
              key={session.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border transition-all duration-150",
                isCurrent
                  ? "bg-accent"
                  : "border-border bg-card hover:bg-muted/30",
              )}
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  isCurrent
                    ? "bg-amber-50 text-amber-900"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <DeviceIcon type={icon} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">
                    {browser} on {os}
                  </p>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      Current
                    </span>
                  )}
                </div>

                <p className="text-start text-xs text-muted-foreground mt-0.5">
                  {device}
                </p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  {session.ipAddress && (
                    <div className="flex items-center gap-1 min-w-0">
                      <WifiIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                      <p className="text-[11px] font-mono text-muted-foreground truncate max-w-30">
                        {session.ipAddress}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    <GlobeIcon className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {timeAgo(session.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {!isCurrent && (
                <button
                  onClick={() => handleRevoke(session.id)}
                  disabled={isBeingRevoked || isRevoking}
                  className={cn(
                    "shrink-0 mt-0.5 h-7 px-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1",
                    "text-destructive hover:bg-destructive/10 active:bg-destructive/20",
                    "disabled:opacity-40 disabled:cursor-not-allowed",
                  )}
                >
                  <LogOutIcon className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {isBeingRevoked ? "Revoking…" : "Revoke"}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {expiredCount > 0 && (
        <p className="text-[11px] text-muted-foreground text-center pt-1 pb-2">
          {expiredCount} expired session{expiredCount !== 1 ? "s" : ""} not
          shown
        </p>
      )}
    </div>
  );
}
