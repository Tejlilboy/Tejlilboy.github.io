"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { id: "projects", label: "projects" },
  { id: "log", label: "build log" },
  { id: "about", label: "about" },
  { id: "resume", label: "resume" },
  { id: "contact", label: "contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Highlight the section currently on screen (home page only)
  useEffect(() => {
    if (!onHome || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome]);

  return (
    <header className="nav">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="Home">
          <span className="brand-eyes" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>tejwant.lilboy</span>
        </Link>
        <button className="nav-toggle" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>
          {open ? "close" : "menu"}
        </button>
        <ul className={`nav-links${open ? " open" : ""}`} id="nav-links">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={onHome ? `#${l.id}` : `/#${l.id}`}
                aria-current={onHome && active === l.id ? "true" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
