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
      setError("Image must be under 4MB");
      return;
    }

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    setPreview(base64);
    setError(null);
    setUploading(true);

    try {
      await onUpload(base64);
    } catch {
      setPreview(null);
      setError("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const currentImage = preview ?? image;

  return (
    <div className="relative shrink-0">
      {uploading && (
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin z-10 pointer-events-none" />
      )}
      <div
        className={cn(
          "h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-md text-base sm:text-lg transition-all",
          uploading
            ? "opacity-70"
            : "ring-2 ring-violet-200 dark:ring-violet-800",
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
          <div className="h-full w-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            {getInitials(name)}
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full",
          "border-2 border-background shadow-sm",
          "flex items-center justify-center",
          "hover:scale-110 active:scale-95 transition-transform",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "size-5",
          emailVerified
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-amber-400 hover:bg-amber-500",
        )}
        title="Change profile picture"
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
        <p className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 text-[10px] text-destructive whitespace-nowrap bg-background border border-destructive/30 rounded px-1.5 py-0.5 shadow-sm z-10">
          {error}
        </p>
      )}
    </div>
  );
}
