import type { Metadata, Viewport } from "next";
import Nav from "@/components/Nav";
import { profile } from "@/lib/site";
import "./globals.css";

// The address the site will be published at (used for link previews).
const SITE_URL = "https://tejlilboy.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} · Robotics & Hardware Portfolio`,
    template: `%s · ${profile.name}`,
  },
  description: `Robotics and hardware projects by ${profile.name}, ${profile.role}: custom PCBs, ESP32 firmware, CAD and robot control apps.`,
  openGraph: {
    title: `${profile.name} · Robotics & Hardware Portfolio`,
    description: "Custom PCBs, ESP32 firmware, CAD and the robots they become.",
    images: ["/images/quadbot/hero.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#07090c" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <footer>
          <div className="wrap">
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span>
              built with Next.js · <a href="#top">back to top ↑</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
