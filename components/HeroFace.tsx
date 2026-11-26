"use client";

import { useEffect, useRef, useState } from "react";

type Mood = "" | "happy" | "sleepy";

/** The robot face in the hero: eyes follow the pointer, blink, smile when tapped, and doze off when idle. */
export default function HeroFace() {
  const faceRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>("");
  const [blink, setBlink] = useState(false);
  const moodRef = useRef<Mood>("");
  const moodTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const changeMood = (m: Mood, ms?: number) => {
    moodRef.current = m;
    setMood(m);
    clearTimeout(moodTimer.current);
    if (ms) moodTimer.current = setTimeout(() => changeMood(""), ms);
  };

  const resetIdle = () => {
    if (moodRef.current === "sleepy") changeMood("");
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => changeMood("sleepy"), 25000);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let blinkTimer: ReturnType<typeof setTimeout>;
    const doBlink = () => {
      if (moodRef.current !== "sleepy") {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
      }
      blinkTimer = setTimeout(doBlink, 2200 + Math.random() * 4200);
    };
    blinkTimer = setTimeout(doBlink, 1500);

    const onMove = (e: PointerEvent) => {
      const face = faceRef.current, eyes = eyesRef.current;
      if (!face || !eyes) return;
      const r = face.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      const dx = clamp(((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2);
      const dy = clamp(((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 2);
      eyes.style.transform = `translate(${dx * 14}%, ${dy * 16}%)`;
      resetIdle();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    resetIdle();

    return () => {
      window.removeEventListener("pointermove", onMove);
      clearTimeout(blinkTimer);
      clearTimeout(idleTimer.current);
      clearTimeout(moodTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="face"
      ref={faceRef}
      aria-hidden="true"
      onClick={() => {
        changeMood("happy", 1400);
        resetIdle();
      }}
    >
      <div className="oled">
        <div ref={eyesRef} className={["eyes", mood, blink ? "blink" : ""].filter(Boolean).join(" ")}>
          <div className="eye" />
          <div className="eye" />
        </div>
      </div>
      <p className="face-caption">{"// tap me"}</p>
    </div>
  );
}
