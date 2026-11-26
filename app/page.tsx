import Link from "next/link";
import HeroFace from "@/components/HeroFace";
import ProjectGrid from "@/components/ProjectGrid";
import { asset, formatDate, getProject, profile, projects, shortUrl, updates } from "@/lib/site";

function Traces() {
  return (
    <svg className="traces" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M-10 120 H260 L320 180 H560 L600 140 H780" />
      <path className="pulse" d="M-10 120 H260 L320 180 H560 L600 140 H780" />
      <path d="M-10 470 H180 L240 410 H470 L520 460 H700 L740 500 H1210" />
      <path className="pulse p2" d="M-10 470 H180 L240 410 H470 L520 460 H700 L740 500 H1210" />
      <path d="M1210 90 H1000 L950 140 H860 L820 100" />
      <path className="pulse p3" d="M1210 90 H1000 L950 140 H860 L820 100" />
      <path d="M1210 300 H1100 L1060 340 H980" />
      <path d="M120 600 V540 L160 500 H300" />
      {[[780, 140, 6], [820, 100, 6], [980, 340, 6], [300, 500, 6], [560, 180, 4], [470, 410, 4]].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </svg>
  );
}

function SectionHead({ n, label, title }: { n: string; label: string; title: string }) {
  return (
    <div className="sec-head">
      <div>
        <p className="sec-label">
          <b>{n}</b> {`// ${label}`}
        </p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

const Soon = () => <span className="soon">coming soon</span>;

export default function Home() {
  return (
    <main id="top">
      {/* ================= HERO ================= */}
      <div className="hero">
        <Traces />
        <div className="wrap">
          <div>
            <p className="kicker">hello, world</p>
            <h1>{profile.name}</h1>
            <p className="role">
              <b>{profile.role}</b>
              {profile.school && ` · ${profile.school}`}
            </p>
            <p className="lead">{profile.tagline}</p>
            <div className="btns">
              <a className="btn primary" href="#projects">View projects →</a>
              <a className="btn" href="#resume">Resume</a>
              <a className="btn" href="#contact">Contact</a>
            </div>
          </div>
          <HeroFace />
        </div>
      </div>

      {/* ================= PROJECTS ================= */}
      <section id="projects">
        <div className="wrap">
          <ProjectGrid projects={projects} />
        </div>
      </section>

      {/* ================= BUILD LOG ================= */}
      <section id="log">
        <div className="wrap">
          <SectionHead n="02" label="build log" title="Latest from the bench" />
          <ol className="log">
            {updates.length === 0 && <li><p>No updates yet.</p></li>}
            {updates.map((u, i) => {
              const p = u.project ? getProject(u.project) : undefined;
              return (
                <li key={u.date + i}>
                  <time dateTime={u.date}>{formatDate(u.date)}</time>
                  {p && (
                    <>
                      {" · "}
                      <Link className="mono" style={{ fontSize: 12 }} href={`/projects/${p.id}/`}>
                        {p.title}
                      </Link>
                    </>
                  )}
                  <h3>{u.title}</h3>
                  <p>{u.text}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about">
        <div className="wrap">
          <SectionHead n="03" label="about" title="About me" />
          <div className="about-grid">
            <div>
              {profile.bio.map((t, i) => <p key={i}>{t}</p>)}
              <ul className="pills">
                {profile.interests.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
            <div className="panel">
              <h3>Experience</h3>
              <div className="xp">
                {profile.experience.map((x, i) => (
                  <div className="xp-item" key={i}>
                    <h3>{x.title}</h3>
                    <p className="meta">{x.org} · {x.dates}</p>
                    <p>{x.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="skills">
            {profile.skills.map((g) => (
              <div className="panel" key={g.group}>
                <h3>{g.group}</h3>
                <ul>
                  {g.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RESUME + CONTACT ================= */}
      <section id="resume">
        <div className="wrap">
          <SectionHead n="04" label="resume & contact" title="Let's talk" />
          <div className="split">
            <div className="panel">
              <h3>Resume</h3>
              <p className="muted" style={{ margin: "0 0 18px" }}>
                A one-page summary of my coursework, projects and experience.
              </p>
              {profile.resumeReady ? (
                <div className="btns">
                  <a className="btn primary" href={asset(profile.resume)} download>Download PDF ↓</a>
                  <a className="btn" href={asset(profile.resume)} target="_blank" rel="noopener">Open in browser</a>
                </div>
              ) : (
                <>
                  <div className="btns"><span className="btn" aria-disabled="true">Download PDF ↓</span></div>
                  <p className="soon" style={{ margin: "12px 0 0" }}>{"// resume PDF coming soon"}</p>
                </>
              )}
            </div>
            <div className="panel" id="contact">
              <h3>Contact</h3>
              <ul className="contact-list">
                <li>
                  <span className="k">email</span>
                  {profile.email ? <a href={`mailto:${profile.email}`}>{profile.email}</a> : <Soon />}
                </li>
                <li>
                  <span className="k">github</span>
                  {profile.github ? <a href={profile.github} target="_blank" rel="noopener">{shortUrl(profile.github)}</a> : <Soon />}
                </li>
                <li>
                  <span className="k">linkedin</span>
                  {profile.linkedin ? <a href={profile.linkedin} target="_blank" rel="noopener">{shortUrl(profile.linkedin)}</a> : <Soon />}
                </li>
                <li>
                  <span className="k">school</span>
                  {profile.school}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
