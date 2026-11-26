"use client";

import { useRef, useState } from "react";
import type { Project } from "@/data/types";
import { asset } from "@/lib/site";

/** Photo grid; clicking a photo opens a full-screen viewer (arrow keys to browse). */
export default function Gallery({ items }: { items: Project["gallery"] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [cur, setCur] = useState(0);
  const show = (i: number) => setCur((i + items.length) % items.length);
  const open = (i: number) => {
    show(i);
    dlg.current?.showModal();
  };
  const item = items[cur];

  return (
    <>
      <div className="gallery">
        {items.map((g, i) => (
          <figure key={g.src + i} style={{ margin: 0 }}>
            <button onClick={() => open(i)} aria-label={`Open image: ${g.caption}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(g.src)} alt={g.caption} loading="lazy" decoding="async" width={400} height={300} />
            </button>
            <figcaption>{g.caption}</figcaption>
          </figure>
        ))}
      </div>

      <dialog
        className="lightbox"
        ref={dlg}
        aria-label="Image viewer"
        onClick={(e) => e.target === dlg.current && dlg.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") show(cur - 1);
          if (e.key === "ArrowRight") show(cur + 1);
        }}
      >
        <button className="close" onClick={() => dlg.current?.close()}>
          close ✕
        </button>
        <button className="nav-btn prev" aria-label="Previous image" onClick={() => show(cur - 1)}>
          ‹
        </button>
        <button className="nav-btn next" aria-label="Next image" onClick={() => show(cur + 1)}>
          ›
        </button>
        {item && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(item.src)} alt={item.caption} />
            <p>
              {cur + 1} / {items.length} · {item.caption}
            </p>
          </>
        )}
      </dialog>
    </>
  );
}
