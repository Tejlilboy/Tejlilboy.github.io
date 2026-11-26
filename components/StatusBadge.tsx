import type { Status } from "@/data/types";
import { STATUS } from "@/lib/site";

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`status ${status}`}>{STATUS[status]?.label ?? status}</span>;
}
