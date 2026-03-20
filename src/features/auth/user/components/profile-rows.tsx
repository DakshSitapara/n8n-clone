"use client";

import { useEffect, useState } from "react";
import { CheckIcon, XIcon, PencilIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  icon: Icon,
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

  const commit = async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }
    const err = validate?.(draft) ?? null;
    if (err) {
      setError(err);
      return;
    }
    try {
      await onSave(draft);
      setEditing(false);
      setError(null);
    } catch {
      setError("Failed to save");
    }
  };

  const cancel = () => {
    setDraft(value);
    setError(null);
    setEditing(false);
  };

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  return (
    <div className="group flex items-start gap-3 py-3 border-b border-border last:border-0">
      <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
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
          />
        ) : (
          <p className="text-sm font-medium truncate">{value || "—"}</p>
        )}
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
      <div className="flex items-center gap-1 shrink-0 mt-0.5">
        {editing ? (
          <>
            <button
              onClick={commit}
              disabled={saving}
              className="h-6 w-6 rounded flex items-center justify-center text-green-600 hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
            >
              <CheckIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={cancel}
              disabled={saving}
              className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
          >
            <PencilIcon className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

interface ReadOnlyRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}

export function ReadOnlyRow({
  icon: Icon,
  label,
  value,
  mono,
}: ReadOnlyRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-medium truncate",
            mono && "font-mono text-xs text-muted-foreground",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
