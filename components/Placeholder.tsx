import type { CSSProperties } from "react";
import type { Project } from "@/data/types";
import { STATUS } from "@/lib/site";

/** Glowing robot eyes shown when a project has no photo yet. */
export default function Placeholder({ project, index = 0 }: { project: Project; index?: number }) {
  const style = {
    "--eye-color": (STATUS[project.status] ?? STATUS.upcoming).eye,
    "--delay": `${(index * 0.7) % 4}s`,
  } as CSSProperties;
  return (
    <div className="ph" style={style}>
      <div className="eyes">
        <div className="eye" />
        <div className="eye" />
      </div>
      <span className="label">{project.status === "paused" ? "paused" : "photos soon"}</span>
    </div>
  );
}
