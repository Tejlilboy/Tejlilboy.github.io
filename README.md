# Tejwant Lilboy — Robotics & Hardware Portfolio

A fast, dark "lab bench" portfolio site built with **Next.js**. It builds to plain static files, so it's hosted free on GitHub Pages.

```
portfolio/
├── data/
│   ├── projects.ts     ← ★ ALL PROJECTS live here
│   ├── updates.ts      ← ★ build-log posts
│   ├── profile.ts      ← ★ your name, bio, skills, experience, email, LinkedIn
│   └── types.ts        ← the "shape" of the data (gives you autocomplete; don't edit)
├── public/
│   ├── images/<project>/   ← photos, one folder per project
│   └── resume/             ← your resume PDF
├── app/                ← pages: home (page.tsx), project pages (projects/[id]/page.tsx)
│   └── globals.css     ← look & feel (colors at the top)
├── components/         ← building blocks: cards, filters, robot face, photo viewer
└── .github/workflows/deploy.yml  ← auto-publishes to GitHub Pages when you push
```

**You only ever need to edit the three files marked ★** (plus dropping photos into `public/images/`).

---

## 1. Run it locally

You need **Node.js** (already installed on this PC in `%LOCALAPPDATA%\nodejs`). If a terminal says `npm` isn't recognized, close and reopen it, or restart VS Code, so it picks up the new PATH.

Open a terminal in the `portfolio` folder (in VS Code: **Terminal → New Terminal**):

```bash
npm install      # first time only (or after pulling on a new computer)
npm run dev      # start the local site
```

Open **http://localhost:3000**. Leave it running: every time you save a file, the page updates by itself. Press `Ctrl + C` in the terminal to stop.

**Preview the exact files that get published:**
```bash
npm run build    # builds the site into the /out folder
npm start        # serves /out at http://localhost:3000
```

**Test on your phone:** while `npm run dev` is running, the terminal prints a `Network:` address like `http://192.168.1.32:3000`. Open it on a phone on the same WiFi. If Windows asks about the firewall, allow Node.js on private networks.

---

## 2. Add a project

1. Open `data/projects.ts`.
2. Copy an existing block from `{` to `},` and paste it where you want it in the list. **The order in the file is the order on the site.**
3. Change the fields:

| Field | What it does |
|---|---|
| `id` | Short name used in the URL, lowercase, no spaces (`"hexbot"` → `/projects/hexbot/`) |
| `title` | Name on the card |
| `status` | `"completed"`, `"in-progress"`, `"upcoming"` or `"paused"` |
| `tagline` | One sentence for the card |
| `cover` | Main photo, e.g. `"/images/hexbot/hero.jpg"`, or `""` for the animated robot-eye placeholder |
| `tags` | List of tech tags. They become filter buttons automatically |
| `progress` | Short status line for unfinished projects (optional) |
| `links` | `{ label: "GitHub repo", url: "https://…" }` entries (can be `[]`) |
| `overview` | List of paragraphs |
| `built` | Bullet list: what *you* designed and built |
| `parts` | `["Label", "Value"]` rows for the specs table |
| `challenges` | `{ problem: "…", solution: "…" }` entries |
| `gallery` | `{ src: "/images/…", caption: "…" }` entries |
| `hidden` | `true` hides the project without deleting it |

**VS Code helps you here:** a typo like `status: "complete"` or a missing field gets a **red squiggly underline**, and hovering shows what's wrong. Typing a field name shows autocomplete suggestions. If `npm run dev` shows an error page, it names the file and line to fix.

Any section that's empty (`[]`) is skipped automatically.

## 3. Add photos

1. Make a folder: `public/images/<project-id>/` (e.g. `public/images/trackbot/`).
2. Drop photos in. **Keep them small** (~1400 px wide, under ~300 KB) so the site stays fast on phones. Phone photos are often 5–13 MB; shrink them first with any of:
   - Windows **Photos** app → `…` → *Resize image* → *M*
   - https://squoosh.app (free, in the browser): set width to 1400, quality 80
3. Reference them in `projects.ts` **without** the word `public`:
   ```ts
   cover: "/images/trackbot/hero.jpg",
   gallery: [
     { src: "/images/trackbot/cad-render.jpg", caption: "Fusion 360 render" },
   ],
   ```
   Use lowercase file names with dashes, no spaces (`pcb-soldered.jpg`).

**Videos / GIFs:** for short clips, upload to YouTube and add it to `links` (`{ label: "Demo video", url: "https://youtu.be/…" }`). A small `.gif` or `.webp` can go straight into the gallery like a photo.

## 4. Post a build-log update

Open `data/updates.ts` and add a block **at the top**:
```ts
{
  date: "2026-12-01",
  project: "trackbot",            // a project id, or "" for general news
  title: "Trackbot: PCB ordered",
  text: "Sent the power board to the fab over Thanksgiving."
},
```

## 5. Resume, email and LinkedIn

- The resume lives at `public/resume/Tejwant-Lilboy-Resume.pdf`. To update it, replace that file (keep the name). `resumeReady` in `data/profile.ts` turns the download button on/off.
- In `data/profile.ts` fill in `email` and `linkedin`. Empty values show "coming soon".

---

## 6. Put it online (free) with GitHub Pages

Your site will live at **https://tejlilboy.github.io/**. Publishing is automatic: every `git push` rebuilds and republishes the site.

1. On GitHub, click **New repository**. Name it exactly **`Tejlilboy.github.io`**, set it to **Public**, and don't add a README. Click **Create**.
2. On the new repo, go to **Settings → Pages**. Under *Build and deployment*, set **Source: GitHub Actions**.
3. In a terminal in this `portfolio` folder:
   ```bash
   git remote add origin git@github.com:Tejlilboy/Tejlilboy.github.io.git
   git push -u origin main
   ```
4. Open the repo's **Actions** tab to watch it build (about 1–2 minutes). A green check means it's live at https://tejlilboy.github.io/.

**Updating later:** edit files, check them with `npm run dev`, then
```bash
git add .
git commit -m "Add Trackbot CAD renders"
git push
```

If the Actions run shows a red ✕, click it to see the error. It's usually the same thing `npm run build` would show you locally, so run that first to catch problems before pushing.

---

## Changing the look

All colors are at the top of `app/globals.css`. `--accent` is the glowing cyan used everywhere, and the `--s-…` colors are the status LEDs.
