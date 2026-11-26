import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import Placeholder from "@/components/Placeholder";
import ProjectCard from "@/components/ProjectCard";
import StatusBadge from "@/components/StatusBadge";
import { asset, getProject, projects } from "@/lib/site";

// One page is built for every project in data/projects.ts
export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}
export const dynamicParams = false;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).id);
  if (!p) return {};
  return {
    title: p.title,
    description: p.tagline,
    openGraph: { title: p.title, description: p.tagline, images: p.cover ? [asset(p.cover)] : undefined },
  };
}

function Section({ title, show, children }: { title: string; show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: Props) {
  const p = getProject((await params).id);
  if (!p) notFound();

  const others = projects.filter((x) => x.id !== p.id).slice(0, 4);

  return (
    <main id="top">
      <div className="detail-hero">
        <div className="wrap">
          <Link className="back" href="/#projects">← all projects</Link>
          <br />
          <StatusBadge status={p.status} />
          <h1>{p.title}</h1>
          <p className="lead">{p.tagline}</p>
          {p.progress && p.status !== "completed" && <p className="progress-line">status: {p.progress}</p>}
          <div className="detail-cover">
            {p.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset(p.cover)} alt={p.title} width={1400} height={700} />
            ) : (
              <Placeholder project={p} />
            )}
          </div>
        </div>
      </div>

      <div className="wrap detail-body">
        <div>
          <Section title="Overview" show={p.overview.length > 0}>
            {p.overview.map((t, i) => <p key={i}>{t}</p>)}
          </Section>

          <Section title={p.status === "completed" ? "What I designed & built" : "What I'm designing"} show={p.built.length > 0}>
            <ul className="built">
              {p.built.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </Section>

          <Section title="Challenges & solutions" show={p.challenges.length > 0}>
            {p.challenges.map((c, i) => (
              <div className="challenge" key={i}>
                <div className="q"><span className="k">Problem</span><p>{c.problem}</p></div>
                <div className="a"><span className="k">How I solved it</span><p>{c.solution}</p></div>
              </div>
            ))}
          </Section>

          <Section title="Gallery" show={p.gallery.length > 0}>
            <Gallery items={p.gallery} />
          </Section>
        </div>

        <aside>
          {p.parts.length > 0 && (
            <div className="panel">
              <h3>Parts &amp; specs</h3>
              <table className="specs">
                <tbody>
                  {p.parts.map(([k, v]) => (
                    <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {p.links.length > 0 && (
            <div className="panel">
              <h3>Links</h3>
              <div className="link-list">
                {p.links.map((l) => (
                  <a key={l.url} className="btn" href={l.url} target="_blank" rel="noopener">
                    {l.label} <span>↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="panel">
            <h3>Tech</h3>
            <ul className="tags">
              {p.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </aside>
      </div>

      {others.length > 0 && (
        <section style={{ paddingTop: 24 }}>
          <div className="wrap">
            <p className="sec-label"><b>→</b> {"// more projects"}</p>
            <div className="more" style={{ marginTop: 18 }}>
              {others.map((o, i) => <ProjectCard key={o.id} project={o} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
