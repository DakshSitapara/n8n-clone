"use client";

import {
  CheckCircle2Icon,
  AlertCircleIcon,
  WorkflowIcon,
  KeyRoundIcon,
  CalendarIcon,
  HashIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserData } from "../hooks/use-userData";
import { EditableRow, ReadOnlyRow } from "./profile-rows";
import { getInitials } from "../lib/helpers";
import { toast } from "sonner";

function ProfileSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="px-4 sm:px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-muted shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 w-32 rounded-md bg-muted" />
            <div className="h-3 w-44 rounded-md bg-muted" />
            <div className="h-4 w-16 rounded-full bg-muted" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="py-3 flex flex-col items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-muted" />
            <div className="h-3.5 w-8 rounded bg-muted" />
            <div className="h-2.5 w-12 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="px-4 sm:px-5 pt-4 pb-2 space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-3 py-2">
            <div className="h-4 w-4 rounded bg-muted mt-0.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-16 rounded bg-muted" />
              <div className="h-4 w-36 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileTab() {
  const { user, isLoading, updateUser, isUpdating } = useUserData();

  if (isLoading || !user) return <ProfileSkeleton />;

  const stats = [
    {
      icon: WorkflowIcon,
      label: "Workflows",
      value: user._count?.workflows ?? 0,
    },
    {
      icon: KeyRoundIcon,
      label: "Credentials",
      value: user._count?.credentials ?? 0,
    },
    {
      icon: CalendarIcon,
      label: "Joined",
      value: new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="px-4 sm:px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-md ring-2 ring-violet-200 dark:ring-violet-800 text-base sm:text-lg">
              {user.image ? (
                <picture>
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </picture>
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background flex items-center justify-center shadow-sm",
                user.emailVerified ? "bg-emerald-500" : "bg-amber-400",
              )}
            >
              {user.emailVerified ? (
                <CheckCircle2Icon className="h-2.5 w-2.5 text-white" />
              ) : (
                <AlertCircleIcon className="h-2.5 w-2.5 text-white" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 text-left">
            <p className="font-semibold text-sm sm:text-base leading-tight truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {user.email}
            </p>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-semibold mt-1.5 px-2 py-0.5 rounded-full tracking-wide",
                user.emailVerified
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  user.emailVerified ? "bg-emerald-500" : "bg-amber-400",
                )}
              />
              {user.emailVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-muted/20 text-left">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="py-3 flex flex-col items-center gap-0.5">
            <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground mb-0.5" />
            <p className="text-xs sm:text-sm font-semibold leading-none tabular-nums">
              {value}
            </p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-5 pt-1 pb-2 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-3 mb-1">
          Profile
        </p>
        <EditableRow
          icon={UserIcon}
          label="Full name"
          value={user.name}
          saving={isUpdating}
          validate={(v) =>
            v.trim().length < 1 ? "Name cannot be empty" : null
          }
          onSave={async (name) => {
            await updateUser({ name });
            toast.success("Name updated");
          }}
        />
        <EditableRow
          icon={MailIcon}
          label="Email address"
          value={user.email}
          type="email"
          saving={isUpdating}
          validate={(v) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email"
          }
          onSave={async (email) => {
            await updateUser({ email });
            toast.success("Email updated — please re-verify");
          }}
        />
      </div>

      <div className="px-4 sm:px-5 pb-3 border-t border-border text-left">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-3 mb-1">
          Account
        </p>
        <ReadOnlyRow icon={HashIcon} label="User ID" value={user.id} mono />
      </div>
    </div>
  );
}
