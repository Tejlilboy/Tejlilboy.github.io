import Link from "next/link";
import type { Project } from "@/data/types";
import { asset } from "@/lib/site";
import Placeholder from "./Placeholder";
import StatusBadge from "./StatusBadge";

export default function ProjectCard({ project: p, index = 0 }: { project: Project; index?: number }) {
  return (
    <Link className="card" href={`/projects/${p.id}/`}>
      <div className="card-media">
        {p.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset(p.cover)}
            alt={p.title}
            loading={index < 3 ? "eager" : "lazy"}
            decoding="async"
            width={1400}
            height={875}
          />
        ) : (
          <Placeholder project={p} index={index} />
        )}
      </div>
      <div className="card-body">
        <StatusBadge status={p.status} />
        <h3 className="card-title">{p.title}</h3>
        <p className="card-tag">{p.tagline}</p>
        <ul className="tags">
          {p.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {p.progress && p.status !== "completed" && <p className="card-progress">{p.progress}</p>}
      </div>
    </Link>
  );
}
