# Tejwant Lilboy — Robotics & Hardware Portfolio

A fast, dark "lab bench" portfolio site. Plain HTML, CSS and JavaScript, with **no build step and nothing to install**.

```
portfolio/
├── index.html          ← home page (hero, projects, build log, about, resume, contact)
├── project.html        ← one page that shows any project:  project.html?id=quadbot
├── data/
│   ├── projects.js     ← ★ ALL PROJECTS live here
│   ├── updates.js      ← ★ build-log posts
│   └── profile.js      ← ★ your name, bio, skills, experience, email, LinkedIn
├── images/<project>/   ← photos, one folder per project
├── resume/             ← put your resume PDF here
├── css/style.css       ← look & feel (colors at the top)
└── js/main.js          ← turns the data files into pages (you shouldn't need to touch it)
```

**You only ever need to edit the three files marked ★.**

---

## 1. Run it locally

### Option A: just open it (quickest)
Double-click `index.html`. It opens in your browser and everything works.

### Option B: a real local server (closest to the live site)
Open a terminal **in the `portfolio` folder** and run **one** of these:

| You have… | Command |
|---|---|
| Python (Windows / WSL / Mac) | `python -m http.server 8000` &nbsp;(on WSL/Mac it may be `python3`) |
| VS Code | Install the **Live Server** extension → right-click `index.html` → **Open with Live Server** |
| Node.js | `npx serve .` |

Then open **http://localhost:8000** in your browser. Press `Ctrl + C` in the terminal to stop it.

> **Test on your phone:** with Option B running, find your PC's local IP (`ipconfig` on Windows, look for IPv4, e.g. `192.168.1.23`), and on a phone on the same WiFi open `http://192.168.1.23:8000`. Windows may ask to allow Python through the firewall; click **Allow** for private networks.

After editing a data file, just **refresh the browser**.

---

## 2. Add a project

1. Open `data/projects.js`.
2. Copy an existing block from `{` to `},` and paste it where you want it in the list. **The order in the file is the order on the site.**
3. Change the fields:

| Field | What it does |
|---|---|
| `id` | Short name used in the URL, lowercase, no spaces (`"hexbot"`) |
| `title` | Name on the card |
| `status` | `"completed"`, `"in-progress"`, `"upcoming"` or `"paused"` |
| `tagline` | One sentence for the card |
| `cover` | Path to the main photo, or `""` for the animated robot-eye placeholder |
| `tags` | List of tech tags. They become filter buttons automatically |
| `progress` | Short status line for unfinished projects (optional) |
| `links` | `{ label: "GitHub repo", url: "https://…" }` entries (can be `[]`) |
| `overview` | List of paragraphs |
| `built` | Bullet list: what *you* designed and built |
| `parts` | `["Label", "Value"]` rows for the specs table |
| `challenges` | `{ problem: "…", solution: "…" }` entries |
| `gallery` | `{ src: "images/…", caption: "…" }` entries |
| `hidden` | `true` hides the project without deleting it |

Watch your commas: every `{ … }` block and every list item needs a comma after it. If the page goes blank, a missing comma or quote is almost always the cause. Press `F12` in the browser and look at the **Console** tab for the line number.

Any section that's empty (`[]`) is skipped automatically.

## 3. Add photos

1. Make a folder: `images/<project-id>/` (e.g. `images/pip/`).
2. Drop photos in. **Keep them small** (~1400 px wide, under ~300 KB) so the site stays fast on phones. Phone photos are often 5–13 MB; shrink them first with any of:
   - Windows **Photos** app → `…` → *Resize image* → *M*
   - https://squoosh.app (free, in the browser): set width to 1400, quality 80
3. Reference them in `projects.js`:
   ```js
   cover: "images/pip/hero.jpg",
   gallery: [
     { src: "images/pip/cad-render.jpg", caption: "Fusion 360 render" },
   ]
   ```
   Use lowercase file names with dashes, no spaces (`pcb-soldered.jpg`).

**Videos / GIFs:** for short clips, upload to YouTube and add it to `links` (`{ label: "Demo video", url: "https://youtu.be/…" }`). A small `.gif` or `.webp` can go straight into the gallery like a photo.

## 4. Post a build-log update

Open `data/updates.js` and add a block **at the top**:
```js
{
  date: "2026-12-01",
  project: "pip",                 // a project id, or "" for general news
  title: "Pip: PCB ordered",
  text: "Sent the power board to the fab over Thanksgiving."
},
```

## 5. Add your resume, email and LinkedIn

- Put the PDF at `resume/Tejwant-Lilboy-Resume.pdf`, then in `data/profile.js` set `resumeReady: true`.
- In `data/profile.js` fill in `email` and `linkedin`. Empty values show "coming soon".

---

## 6. Put it online (free) with GitHub Pages

Your site will live at **https://tejlilboy.github.io/**.

1. On GitHub, click **New repository**. Name it exactly **`Tejlilboy.github.io`**, set it to **Public**, and don't add a README. Click **Create**.
2. In a terminal in this `portfolio` folder:
   ```bash
   git init            # skip if already a repo
   git add .
   git commit -m "Portfolio site v1"
   git branch -M main
   git remote add origin git@github.com:Tejlilboy/Tejlilboy.github.io.git
   git push -u origin main
   ```
3. On GitHub, go to the repo → **Settings** → **Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`**, then **Save**.
4. Wait 1–2 minutes and open https://tejlilboy.github.io/.

**Updating later:** edit files, then
```bash
git add .
git commit -m "Add Pip CAD renders"
git push
```
The live site updates within a minute or two.

*(Netlify alternative: sign in at netlify.com → "Add new site" → "Deploy manually" → drag the `portfolio` folder onto the page.)*

---

## Changing the look

All colors are at the top of `css/style.css`. `--accent` is the glowing cyan used everywhere, and the `--s-…` colors are the status LEDs.
