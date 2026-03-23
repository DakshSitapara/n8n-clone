"use client";

import { getInitials } from "../lib/helpers";

export function AvatarDisplay({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  return (
    <>
      <div className="h-4 w-4 rounded-full flex items-center justify-center overflow-hidden shrink-0">
        {image ? (
          <picture>
            <img
              src={image}
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
      <span className="truncate w-full">{name}</span>
    </>
  );
}
