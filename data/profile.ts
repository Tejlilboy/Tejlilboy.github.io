/* =====================================================================
   PROFILE — your name, links, bio, skills and experience.
   Edit the text between the quotes. Leave a value as "" to hide it.
   ===================================================================== */
import type { Profile } from "./types";

export const profile: Profile = {
  name: "Tejwant Lilboy",
  role: "Computer Engineering @ City Tech",
  school: "New York City College of Technology (CUNY)",
  tagline: "I design, build and program small robots: custom PCBs, ESP32 firmware, CAD and the apps that drive them.",

  // ---- Contact (leave a value as "" to show "coming soon") ----
  email: "tejlilboy@gmail.com",
  github: "https://github.com/Tejlilboy",
  linkedin: "https://www.linkedin.com/in/tejwant-lilboy-700810382",

  // ---- Resume: drop your PDF in the public/resume folder with this exact name ----
  resume: "/resume/Tejwant-Lilboy-Resume.pdf",
  resumeReady: true,    // set to false to hide the download button

  // ---- About ----
  bio: [
    "I'm a Computer Engineering student at New York City College of Technology who learns by building. My projects start as a sketch of a robot with a personality, then turn into schematics, KiCad boards, Fusion 360 parts and firmware that ties it all together.",
    "I like working where hardware meets software: picking parts, laying out power distribution, chasing down why a servo jitters, and then writing the phone app that makes the robot fun to drive."
  ],
  interests: ["Robotics", "Embedded systems", "PCB design", "Electronics", "FPV drones", "Human-robot interaction"],

  skills: [
    { group: "Hardware", items: ["KiCad schematic + PCB layout", "Soldering & board bring-up", "Power distribution (Li-ion, buck regulators)", "Servo & DC motor drivers", "Sensors: ToF, IMU, joysticks", "OLED / TFT displays"] },
    { group: "Software", items: ["C / C++ (Arduino framework)", "ESP32: LEDC PWM, WiFi AP, Bluetooth", "WebSockets", "HTML / CSS / JavaScript", "Android (Java)", "Bash scripting"] },
    { group: "Tools", items: ["Fusion 360", "3D printing (FDM)", "Arduino IDE", "Git & GitHub", "Multimeter", "Linux / WSL"] }
  ],

  experience: [
    {
      title: "Part-time Administrative Assistant",
      org: "Loyalty Tax Services, Queens, NY",
      dates: "~5 years, part-time",
      text: "Worked on a team handling client files each tax season: organizing documents, keeping records accurate, and hitting firm deadlines alongside coursework."
    }
  ]
};
