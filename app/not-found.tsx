import Link from "next/link";

export default function NotFound() {
  return (
    <main id="top">
      <div className="wrap detail-hero" style={{ minHeight: "50vh" }}>
        <Link className="back" href="/#projects">← all projects</Link>
        <p className="sec-label"><b>404</b> {"// not found"}</p>
        <h1>Nothing on this pin.</h1>
        <p className="lead">That page doesn&apos;t exist (yet).</p>
      </div>
    </main>
  );
}
