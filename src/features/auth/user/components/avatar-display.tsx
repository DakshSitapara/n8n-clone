"use client";

import { getInitials } from "../lib/helpers";

export function AvatarDisplay({
  name,
  image,
  onClick,
}: {
  name: string;
  image?: string | null;
  onClick?: () => void;
}) {
  return (
    <>
      <div
        onClick={onClick}
        className="h-4 w-4 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0"
      >
        {image ? (
          <picture>
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </picture>
        ) : (
          <span className="text-[9px] font-bold text-white leading-none">
            {getInitials(name)}
          </span>
        )}
      </div>
      <span className="truncate w-full" onClick={onClick}>
        {name}
      </span>
    </>
  );
}
