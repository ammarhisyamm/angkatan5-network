export function formatEventDate(iso: string) {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return { day: String(day), month, weekday, time };
}

export function formatEventRange(startIso: string, endIso?: string) {
  const s = new Date(startIso);
  const dateStr = s.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
  const startTime = s.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (!endIso) return `${dateStr} • ${startTime}`;
  const endTime = new Date(endIso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${dateStr} • ${startTime}–${endTime}`;
}

export function eventCountdown(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Started";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `in ${hours}h`;
  const days = Math.floor(hours / 24);
  return `in ${days}d`;
}
