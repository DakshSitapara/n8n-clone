export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function timeAgo(d: Date | string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
}

export function parseUserAgent(ua: string | null | undefined): {
  device: string;
  browser: string;
  os: string;
  icon: "desktop" | "mobile" | "tablet";
} {
  if (!ua)
    return {
      device: "Unknown",
      browser: "Unknown",
      os: "Unknown OS",
      icon: "desktop",
    };
  const isTablet = /tablet|ipad|playbook|silk/i.test(ua);
  const isMobile = /mobile|iphone|ipod|android|blackberry/i.test(ua);
  return {
    icon: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
    device: isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop",
    browser: /Edg\//.test(ua)
      ? "Edge"
      : /OPR\/|Opera/.test(ua)
        ? "Opera"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Firefox\//.test(ua)
            ? "Firefox"
            : /Safari\//.test(ua) && !/Chrome/.test(ua)
              ? "Safari"
              : "Browser",
    os: /Windows NT 10/.test(ua)
      ? "Windows 10"
      : /Windows NT 11/.test(ua)
        ? "Windows 11"
        : /Windows/.test(ua)
          ? "Windows"
          : /Mac OS X/.test(ua)
            ? "macOS"
            : /Android/.test(ua)
              ? "Android"
              : /iPhone|iPad/.test(ua)
                ? "iOS"
                : /Linux/.test(ua)
                  ? "Linux"
                  : "Unknown OS",
  };
}
