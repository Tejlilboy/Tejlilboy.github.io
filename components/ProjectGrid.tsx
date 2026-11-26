"use client";

import { useMemo, useState } from "react";
import type { Project, Status } from "@/data/types";
import { STATUS } from "@/lib/site";
import ProjectCard from "./ProjectCard";

/** Project cards with status + tag filter chips. */
export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [status, setStatus] = useState<Status | "all">("all");
  const [tag, setTag] = useState<string | null>(null);

  const statuses = useMemo(
    () => (Object.keys(STATUS) as Status[]).filter((s) => projects.some((p) => p.status === s)),
    [projects],
  );

  // tags sorted by how often they appear
  const tags = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => p.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  }, [projects]);

  const shown = projects.filter(
    (p) => (status === "all" || p.status === status) && (!tag || p.tags.includes(tag)),
  );

  return (
    <>
      <div className="sec-head">
        <div>
          <p className="sec-label">
            <b>01</b> {"// projects"}
          </p>
          <h2>Things I&apos;ve built (and am building)</h2>
        </div>
        <p className="muted mono" style={{ fontSize: 13, margin: 0 }}>
          showing {shown.length} of {projects.length}
        </p>
      </div>

      <div className="filters" role="group" aria-label="Filter projects">
        <div className="chip-row">
          <span className="lbl">status</span>
          <button className="chip" aria-pressed={status === "all"} onClick={() => setStatus("all")}>
            All <span className="n">{projects.length}</span>
          </button>
          {statuses.map((s) => (
            <button key={s} className="chip" aria-pressed={status === s} onClick={() => setStatus(s)}>
              {STATUS[s].label} <span className="n">{projects.filter((p) => p.status === s).length}</span>
            </button>
          ))}
        </div>
        <div className="chip-row">
          <span className="lbl">tags</span>
          {tags.map((t) => (
            <button key={t} className="chip" aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid" aria-live="polite">
        {shown.length ? (
          shown.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)
        ) : (
          <div className="empty">no projects match that filter yet — check back soon</div>
        )}
      </div>
    </>
  );
}
