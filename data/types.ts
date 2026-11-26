/* =====================================================================
   The "shape" of the data files. You don't need to edit this.
   It's what makes VS Code autocomplete fields and underline typos
   (like status: "complete" instead of "completed") in red.
   ===================================================================== */

export type Status = "completed" | "in-progress" | "upcoming" | "paused";

export interface Project {
  /** Short lowercase name used in the URL: /projects/<id> */
  id: string;
  title: string;
  status: Status;
  /** One sentence shown on the card */
  tagline: string;
  /** Path to the main photo, e.g. "/images/quadbot/hero.jpg", or "" for the robot-eye placeholder */
  cover: string;
  tags: string[];
  links: { label: string; url: string }[];
  /** Short status line for unfinished projects */
  progress?: string;
  overview: string[];
  built: string[];
  /** ["Label", "Value"] rows for the specs table */
  parts: [string, string][];
  challenges: { problem: string; solution: string }[];
  gallery: { src: string; caption: string }[];
  /** true = keep in the file but hide from the site */
  hidden?: boolean;
}

export interface Update {
  /** "YYYY-MM-DD" */
  date: string;
  /** A project id, or "" for general news */
  project: string;
  title: string;
  text: string;
}

export interface Profile {
  name: string;
  role: string;
  school: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  resumeReady: boolean;
  bio: string[];
  interests: string[];
  skills: { group: string; items: string[] }[];
  experience: { title: string; org: string; dates: string; text: string }[];
}
