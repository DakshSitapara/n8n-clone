"use client";

import { useRef, useState } from "react";
import { CheckIcon, XIcon, PencilIcon, Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function RowShell({
  icon: Icon,
  label,
  children,
  actions,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="group flex items-start gap-3 py-3 border-b border-border last:border-0">
      <Icon
        className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        {children}
      </div>
      {actions && (
        <div className="flex items-center gap-1 shrink-0 mt-0.5">{actions}</div>
      )}
    </div>
  );
}

interface EditableRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  type?: string;
  validate?: (v: string) => string | null;
  onSave: (v: string) => Promise<void>;
  saving: boolean;
}

export function EditableRow({
  icon,
  label,
  value,
  type = "text",
  validate,
  onSave,
  saving,
}: EditableRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [displayValue, setDisplayValue] = useState(value);

  const committedRef = useRef<string | null>(null);

  const inFlight = committedRef.current !== null;

  if (!editing && !inFlight && value !== displayValue) {
    setDisplayValue(value);
    setDraft(value);
  }

  if (!editing && inFlight && value === committedRef.current) {
    committedRef.current = null;
  }

  const commit = async () => {
    if (draft === displayValue) {
      setEditing(false);
      return;
    }
    const err = validate?.(draft) ?? null;
    if (err) {
      setError(err);
      return;
    }

    const savedDraft = draft;
    committedRef.current = savedDraft;
    setDisplayValue(savedDraft);
    setEditing(false);
    setError(null);

    try {
      await onSave(savedDraft);
    } catch {
      committedRef.current = null;
      setDisplayValue(value);
      setDraft(value);
      setEditing(true);
      setError("Failed to save");
    }
  };

  const cancel = () => {
    setDraft(displayValue);
    setError(null);
    setEditing(false);
  };

  return (
    <RowShell
      icon={icon}
      label={label}
      actions={
        editing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
              onClick={commit}
              disabled={saving}
              aria-label={`Save ${label}`}
            >
              {saving ? (
                <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckIcon className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={cancel}
              disabled={saving}
              aria-label={`Cancel editing ${label}`}
            >
              <XIcon className="h-3.5 w-3.5" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 transition-opacity",
              inFlight
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100",
            )}
            onClick={() => setEditing(true)}
            disabled={inFlight}
            aria-label={`Edit ${label}`}
          >
            {inFlight ? (
              <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <PencilIcon className="h-3.5 w-3.5" />
            )}
          </Button>
        )
      }
    >
      {editing ? (
        <Input
          type={type}
          value={draft}
          autoFocus
          className="h-7 text-sm px-2"
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") cancel();
          }}
          disabled={saving}
          aria-label={label}
          aria-invalid={!!error}
        />
      ) : (
        <p className="text-sm font-medium truncate">{displayValue || "—"}</p>
      )}
      {error && (
        <p className="text-xs text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </RowShell>
  );
}

interface ReadOnlyRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}

export function ReadOnlyRow({ icon, label, value, mono }: ReadOnlyRowProps) {
  return (
    <RowShell icon={icon} label={label}>
      <p
        className={cn(
          "text-sm font-medium truncate",
          mono && "font-mono text-xs text-muted-foreground",
        )}
      >
        {value}
      </p>
    </RowShell>
  );
}
