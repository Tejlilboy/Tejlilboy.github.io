"use client";

import { useEffect, useRef, useState } from "react";

type Mood =
  | ""
  // tap reactions
  | "happy" | "laugh" | "love" | "surprised" | "wink"
  // too many taps
  | "angry" | "dizzy"
  // idle quirks
  | "bored" | "suspicious" | "curious" | "sleepy";

const TAP_MOODS: Mood[] = ["happy", "laugh", "love", "surprised", "wink"];
const IDLE_MOODS: Mood[] = ["bored", "suspicious", "curious", "wink", ""]; // "" = glance around

const CAPTION: Partial<Record<Mood, string>> = {
  happy: "// :)",
  laugh: "// haha",
  love: "// <3",
  surprised: "// !",
  wink: "// ;)",
  angry: "// hey, quit it",
  dizzy: "// whoa…",
  bored: "// ...",
  suspicious: "// hmm",
  curious: "// ?",
  sleepy: "// zzz",
};

const pick = <T,>(xs: T[], not?: T) => {
  const pool = xs.filter((x) => x !== not);
  return pool[Math.floor(Math.random() * pool.length)];
};

/**
 * The robot face in the hero. Eyes follow the pointer and blink; taps cycle through reactions
 * (spam it and it gets annoyed, then dizzy); idle it pulls random faces, glances around and
 * eventually dozes off; scrolling jolts it on a spring, and a hard flick startles it.
 */
export default function HeroFace() {
  const faceRef = useRef<HTMLDivElement>(null);
  const lookRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>("");
  const [blink, setBlink] = useState(false);

  const moodRef = useRef<Mood>("");
  const moodTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const sleepTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const taps = useRef<number[]>([]);

  // eye position (in % of the eye row) from the pointer, or from a scripted glance
  const gaze = useRef({ x: 0, y: 0 });
  const glance = useRef<{ x: number; y: number } | null>(null);
  // scroll spring: offset (px) and velocity
  const jolt = useRef({ y: 0, v: 0 });

  const applyTransforms = () => {
    const face = faceRef.current, look = lookRef.current;
    if (!face || !look) return;
    const g = glance.current ?? gaze.current;
    const { y } = jolt.current;
    face.style.transform = y ? `translateY(${y.toFixed(2)}px) rotate(${(y * 0.12).toFixed(2)}deg)` : "";
    // eyes lag behind the shell a little, like they have inertia
    look.style.transform = `translate(${g.x}%, ${g.y}%) translateY(${(-y * 0.6).toFixed(2)}px)`;
  };

  const changeMood = (m: Mood, ms?: number) => {
    moodRef.current = m;
    setMood(m);
    clearTimeout(moodTimer.current);
    if (ms) moodTimer.current = setTimeout(() => changeMood(""), ms);
  };

  const wake = () => {
    if (moodRef.current === "sleepy") changeMood("surprised", 700);
    clearTimeout(sleepTimer.current);
    sleepTimer.current = setTimeout(() => changeMood("sleepy"), 25000);
  };

  const onTap = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 2500), now];
    const n = taps.current.length;
    if (n >= 8) changeMood("dizzy", 2200);
    else if (n >= 5) changeMood("angry", 1500);
    else changeMood(pick(TAP_MOODS, moodRef.current), 1500);
    wake();
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // --- blinking (only with a neutral face) ---
    let blinkTimer: ReturnType<typeof setTimeout>;
    const doBlink = () => {
      if (moodRef.current === "") {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        // sometimes a quick double blink
        if (Math.random() < 0.2) setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 110); }, 260);
      }
      blinkTimer = setTimeout(doBlink, 2200 + Math.random() * 4200);
    };
    blinkTimer = setTimeout(doBlink, 1500);

    // --- idle quirks: a random face or a glance around every few seconds ---
    let idleTimer: ReturnType<typeof setTimeout>;
    const glanceTimers: ReturnType<typeof setTimeout>[] = [];
    const doIdle = () => {
      if (moodRef.current === "") {
        const m = pick(IDLE_MOODS);
        if (m) changeMood(m, 1600 + Math.random() * 1200);
        else {
          // look left, look right, back to the pointer
          const s = Math.random() < 0.5 ? 1 : -1;
          const steps: [number, { x: number; y: number } | null][] = [
            [0, { x: -14 * s, y: -4 }], [700, { x: 14 * s, y: -2 }], [1400, null],
          ];
          steps.forEach(([at, g]) => glanceTimers.push(setTimeout(() => { glance.current = g; applyTransforms(); }, at)));
        }
      }
      idleTimer = setTimeout(doIdle, 4500 + Math.random() * 5000);
    };
    idleTimer = setTimeout(doIdle, 5000);

    // --- eyes follow the pointer ---
    const onMove = (e: PointerEvent) => {
      const face = faceRef.current;
      if (!face) return;
      const r = face.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      const dx = clamp(((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2);
      const dy = clamp(((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 2);
      gaze.current = { x: dx * 14, y: dy * 16 };
      applyTransforms();
      wake();
    };

    // --- scroll: spring jolt, startled by fast flicks ---
    let raf = 0;
    let lastY = window.scrollY, lastT = performance.now(), lastStartle = 0;
    const step = () => {
      const j = jolt.current;
      j.v += -0.14 * j.y; // spring back
      j.v *= 0.8;         // damping
      j.y = Math.max(-18, Math.min(18, j.y + j.v));
      if (Math.abs(j.y) < 0.05 && Math.abs(j.v) < 0.05) {
        j.y = j.v = 0;
        raf = 0;
      } else raf = requestAnimationFrame(step);
      applyTransforms();
    };
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const speed = Math.abs(dy) / Math.max(now - lastT, 1); // px per ms
      lastY = window.scrollY;
      lastT = now;

      const j = jolt.current;
      j.v -= Math.max(-40, Math.min(40, dy)) * 0.18;
      if (!raf) raf = requestAnimationFrame(step);

      const calm = ["", "bored", "suspicious", "curious", "sleepy"].includes(moodRef.current);
      if (calm && now - lastStartle > 1200) {
        if (speed > 6) { changeMood("dizzy", 1600); lastStartle = now; }
        else if (speed > 2.5) { changeMood("surprised", 800); lastStartle = now; }
      }
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    wake();

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(blinkTimer);
      clearTimeout(idleTimer);
      glanceTimers.forEach(clearTimeout);
      clearTimeout(sleepTimer.current);
      clearTimeout(moodTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="face" ref={faceRef} aria-hidden="true" onClick={onTap}>
      <div className="oled">
        <div ref={lookRef} className={["look", mood, blink ? "blink" : ""].filter(Boolean).join(" ")}>
          <div className="eyes">
            <div className="eye" />
            <div className="eye" />
          </div>
          <div className="mouth" />
        </div>
        <span className="zzz">z<i>z</i><b>z</b></span>
      </div>
      <p className="face-caption">{CAPTION[mood] ?? "// tap me"}</p>
    </div>
  );
}
