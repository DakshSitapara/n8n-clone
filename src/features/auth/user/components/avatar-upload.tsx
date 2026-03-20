"use client";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CameraIcon, LoaderIcon } from "lucide-react";
import { getInitials } from "../lib/helpers";

export default function AvatarUpload({
  name,
  image,
  emailVerified,
  onUpload,
}: {
  name: string;
  image?: string | null;
  emailVerified: boolean;
  onUpload: (base64: string) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Select an image file");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be under 4 MB");
      return;
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // skip if identical to already-saved image
    if (base64 === image) {
      e.target.value = "";
      return;
    }

    setPreview(base64);
    setError(null);
    setUploading(true);

    try {
      await onUpload(base64);
    } catch {
      setPreview(null);
      setError("Upload failed — please try again");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const currentImage = preview ?? image;

  return (
    <div className="relative shrink-0 w-18 h-18">
      {uploading && (
        <div className="absolute -inset-0.75 rounded-full border-2 border-transparent border-t-muted-foreground animate-spin z-10 pointer-events-none" />
      )}

      <div
        className={cn(
          "w-18 h-18 rounded-full overflow-hidden border-2 transition-all duration-200",
          uploading
            ? "opacity-55 border-border"
            : emailVerified
              ? "border-emerald-300 dark:border-emerald-700"
              : "border-border",
        )}
      >
        {currentImage ? (
          <picture>
            <img
              src={currentImage}
              alt={name}
              className="h-full w-full object-cover"
            />
          </picture>
        ) : (
          <picture>
            <img
              src={`https://avatar.vercel.sh/${name}.svg?text=${getInitials(name)}&rounded=60`}
              alt={name}
              className="h-full w-full object-cover"
            />
          </picture>
        )}
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={() => {
          setError(null);
          inputRef.current?.click();
        }}
        title="Change profile picture"
        className={cn(
          "absolute bottom-0.5 right-0.5 w-5.5 h-5.5 rounded-full z-20",
          "border-2 border-background",
          "flex items-center justify-center",
          "transition-transform hover:scale-110 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          emailVerified
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-amber-400 hover:bg-amber-500",
        )}
      >
        {uploading ? (
          <LoaderIcon className="h-2.5 w-2.5 text-white animate-spin" />
        ) : (
          <CameraIcon className="h-2.5 w-2.5 text-white" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-30 text-[11px] text-destructive whitespace-nowrap bg-background border border-destructive/30 rounded-md px-2 py-1 shadow-sm">
          {error}
        </p>
      )}
    </div>
  );
}
