import { profile } from "@/data/profile";
import { projects as allProjects } from "@/data/projects";
import { updates } from "@/data/updates";
import type { Project, Status } from "@/data/types";

export { profile, updates };

/** Key order here is also the display order of projects on the site. */
export const STATUS: Record<Status, { label: string; eye: string }> = {
  completed: { label: "Completed", eye: "var(--s-completed)" },
  "in-progress": { label: "In progress", eye: "var(--s-in-progress)" },
  upcoming: { label: "Upcoming", eye: "var(--s-upcoming)" },
  paused: { label: "Paused", eye: "var(--s-paused)" },
};

const statusRank = Object.keys(STATUS) as Status[];

/** Projects that should appear on the site: grouped by status (completed first), file order within each group. */
export const projects: Project[] = allProjects
  .filter((p) => !p.hidden)
  .sort((a, b) => statusRank.indexOf(a.status) - statusRank.indexOf(b.status));

export const getProject = (id: string) => projects.find((p) => p.id === id);

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
