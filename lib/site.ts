import { profile } from "@/data/profile";
import { projects as allProjects } from "@/data/projects";
import { updates } from "@/data/updates";
import type { Project, Status } from "@/data/types";

export { profile, updates };

/** Projects that should appear on the site, in file order. */
export const projects: Project[] = allProjects.filter((p) => !p.hidden);

export const getProject = (id: string) => projects.find((p) => p.id === id);

export const STATUS: Record<Status, { label: string; eye: string }> = {
  completed: { label: "Completed", eye: "var(--s-completed)" },
  "in-progress": { label: "In progress", eye: "var(--s-in-progress)" },
  upcoming: { label: "Upcoming", eye: "var(--s-upcoming)" },
  paused: { label: "Paused", eye: "var(--s-paused)" },
};

/** Lets data files use "images/x.jpg" or "/images/x.jpg" — both work. */
export const asset = (path: string) =>
  !path || /^(https?:)?\/\//.test(path) || path.startsWith("/") ? path : "/" + path;

export function formatDate(d: string) {
  const dt = new Date(d + "T12:00:00");
  return isNaN(dt.getTime())
    ? d
    : dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export const shortUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
