import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build to plain HTML/CSS/JS files in /out, so it can be hosted free on GitHub Pages.
  output: "export",
  // /projects/quadbot -> /projects/quadbot/index.html (what GitHub Pages expects)
  trailingSlash: true,
  // Photos are already resized; no image server is available on static hosting.
  images: { unoptimized: true },
};

export default nextConfig;
