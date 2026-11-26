/* =====================================================================
   PROJECTS — every project on the site lives here.

   To add a project: copy one { ... } block, paste it into the list,
   and change the text. See README.md for what each field does.

   status must be one of:  "completed"  "in-progress"  "upcoming"  "paused"
   cover: path to a photo, or "" to show the animated robot-eye placeholder.
   hidden: true keeps a project in this file but off the site.
   ===================================================================== */
window.PROJECTS = [

  /* ------------------------------------------------------------------ */
  {
    id: "quadbot",
    title: "Quadbot",
    status: "completed",
    tagline: "Eight-servo quadruped with a custom power PCB, hand-written servo driver and a phone controller.",
    cover: "images/quadbot/hero.jpg",
    tags: ["KiCad", "PCB", "ESP32", "Firmware", "Servos", "Web App", "3D Printing"],
    links: [
      { label: "GitHub repo", url: "https://github.com/Tejlilboy/QuadBot" }
    ],
    overview: [
      "Quadbot is a four-legged walking robot driven by a Seeed XIAO ESP32-S3 and eight MG90S servos. It walks, turns, crab-walks and performs tricks (wave, dance, push-ups, bow, play dead), while an OLED face with rounded-rectangle eyes reacts to everything it does.",
      "The body is printed from the open-source Sesame project's STL files. Everything else is my own work: component selection, a custom 2-layer power distribution PCB, the firmware, the phone web app and an Android app."
    ],
    built: [
      "Custom 2-layer power distribution PCB in KiCad that feeds eight servos and the ESP32 from one 2S Li-ion pack through a 5 V buck converter",
      "Full firmware in C++: a non-blocking gait engine, pose tables, 8 tricks and an auto-sleep state machine",
      "A servo driver written directly on the ESP32's LEDC PWM peripheral (50 Hz, 14-bit, one channel per servo) with speed-limited, smooth motion",
      "OLED face engine drawn in code: blink transitions between faces and 24 random idle animations",
      "Three ways to drive it: an Xbox controller over Bluetooth, any phone browser over the robot's own WiFi network, or a full-screen Android app"
    ],
    parts: [
      ["Microcontroller", "Seeed XIAO ESP32-S3"],
      ["Actuators", "8× MG90S metal-gear servos"],
      ["Display", "SSD1306 128×64 OLED (I²C)"],
      ["Power", "7.4 V 800 mAh 2S Li-ion → 5 V buck converter"],
      ["Distribution", "Custom KiCad power distribution PCB"],
      ["Control", "Xbox controller (Bluetooth) or phone (WiFi + WebSocket)"]
    ],
    challenges: [
      { problem: "Standard Arduino servo libraries wouldn't reliably drive all eight servos on the ESP32-S3.",
        solution: "I skipped the libraries and configured the ESP32's LEDC PWM peripheral by hand: one 50 Hz, 14-bit channel per servo. Writing an angle sets a target, and the driver glides toward it at a limited speed, which also made every motion smoother." },
      { problem: "Eight servos in a small body need a lot of current and a lot of wiring.",
        solution: "I designed a compact 2-layer PCB that distributes regulated 5 V to every servo header and the microcontroller from a single point." },
      { problem: "Phone control has to be safe when the connection drops.",
        solution: "A 0.5 s deadman timer releases all inputs if the phone goes quiet, and the face shows a 'connection lost' expression after 4 s. Only one phone can drive at a time." }
    ],
    gallery: [
      { src: "images/quadbot/hero.jpg", caption: "Quadbot with its OLED eyes lit" },
      { src: "images/quadbot/schematic.jpg", caption: "Power distribution schematic (KiCad)" },
      { src: "images/quadbot/pcb-layout.jpg", caption: "2-layer PCB layout" },
      { src: "images/quadbot/pcb-unsoldered.jpg", caption: "Bare boards back from the fab" },
      { src: "images/quadbot/pcb-soldered.jpg", caption: "Assembled power board" },
      { src: "images/quadbot/web-app.jpg", caption: "Phone web controller: dual joysticks + trick buttons" }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "pip",
    title: "Pip",
    status: "in-progress",
    tagline: "A tracked desk-robot companion with moods, memory and a forklift arm.",
    cover: "",
    tags: ["Fusion 360", "ESP32", "Motor Control", "Sensors", "Web App", "Firmware"],
    links: [],
    progress: "CAD done · firmware first draft written · custom PCB and final assembly next · class demo planned",
    overview: [
      "Pip (repo name: Trackbot) is a small tracked robot that lives on a desk and has a personality, in the spirit of Anki's Cozmo. It's built on Quadbot's body with a drivetrain and track system I designed from scratch.",
      "Pip has moods, remembers its day across power-offs, naps during a study timer, mirrors your arm for high fives, and gets stubborn when it's angry."
    ],
    built: [
      "Complete Fusion 360 model, including a custom 35-link-per-side track system based on Lego Technic-style treads",
      "Drivetrain: two N20 90° worm-gear motors (one per side) on a DRV8833 driver",
      "Power: 2S Li-ion → 3 A buck → 5 V rail → XIAO ESP32-S3, with a custom PCB planned",
      "Phone web app: dual joysticks (drive + forklift), mood rings for happiness, sadness and anger, manual override, live 8×8 ToF view, music streaming and a focus timer where Pip naps",
      "Behaviors: daily routine with memory across power-offs, arm mirroring and high fives, sneezes, hiccups and zoomies"
    ],
    parts: [
      ["Microcontroller", "Seeed XIAO ESP32-S3"],
      ["Drive", "2× N20 worm-gear motors + DRV8833"],
      ["Sensors", "8×8 Time-of-Flight array, IMU"],
      ["Output", "OLED emote screen, forklift servo, speaker for chirps"],
      ["Power", "2S Li-ion → 3 A buck → 5 V"]
    ],
    challenges: [
      { problem: "Off-the-shelf tracks didn't fit the body or the motor layout.",
        solution: "I modeled my own track system in Fusion 360 (35 links per side) around Technic-style treads and the worm-gear motors." },
      { problem: "Making a robot feel alive, not just remote-controlled.",
        solution: "The 8×8 ToF sensor gives Pip 'sight' for hand tracking and wander mode, and mood values drift with how it's treated." }
    ],
    gallery: []
  },

  /* ------------------------------------------------------------------ */
  {
    id: "gripper",
    title: "Gripper Arm",
    status: "completed",
    tagline: "My first robot: a five-servo, dual-joystick robotic arm on a custom Arduino Nano PCB.",
    cover: "images/gripper/hero.jpg",
    tags: ["KiCad", "PCB", "Arduino", "Firmware", "Servos", "3D Printing"],
    links: [
      { label: "GitHub repo", url: "https://github.com/Tejlilboy/Gripper" }
    ],
    overview: [
      "A desk-clamped robotic arm driven by an Arduino Nano and five SG90 metal-gear servos, controlled with two analog joysticks. It has a rotating base, two arm joints, a rotating wrist and a gear-driven claw.",
      "It was my first personal hardware project and the one where I learned the basics of power planning, analog input and PCB design that later projects build on."
    ],
    built: [
      "Custom KiCad PCB carrying the Nano, servo headers, bulk capacitance and RC low-pass filters on every joystick axis",
      "Firmware mapping four analog axes to servo angles with safe limits, a joystick dead zone, and a debounced claw open/close button",
      "Separate 5 V / 5 A buck supply for the servos, sharing a common ground with the Arduino"
    ],
    parts: [
      ["Microcontroller", "Arduino Nano V3"],
      ["Actuators", "5× SG90 metal-gear servos"],
      ["Input", "2× analog joystick modules"],
      ["Power", "5 V, 5 A buck converter"],
      ["Board", "Custom KiCad PCB"]
    ],
    challenges: [
      { problem: "Joystick noise made the arm twitch even when the sticks were centered.",
        solution: "RC low-pass filters on the PCB plus a software dead zone keep the arm still until you mean to move it." },
      { problem: "Five servos stalling at once can brown out the Arduino.",
        solution: "Servos run from a dedicated 5 A buck converter sized for a five-servo stall, with a shared ground." }
    ],
    gallery: [
      { src: "images/gripper/hero.jpg", caption: "Arm with its joystick controller box" },
      { src: "images/gripper/side.jpg", caption: "Side view" },
      { src: "images/gripper/schematic.jpg", caption: "Schematic (KiCad)" },
      { src: "images/gripper/pcb-layout.jpg", caption: "PCB layout" },
      { src: "images/gripper/pcb-3d.jpg", caption: "3D board preview" },
      { src: "images/gripper/pcb-unsoldered.jpg", caption: "Bare board" },
      { src: "images/gripper/pcb-soldered.jpg", caption: "Assembled board in the controller box" }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "deskbot",
    title: "Deskbot",
    status: "upcoming",
    tagline: "A USB-powered desk companion that gives an LLM eyes, ears and a face.",
    cover: "",
    tags: ["ESP32", "LLM", "Audio", "Sensors"],
    links: [],
    progress: "Next up after Pip",
    overview: [
      "Deskbot is a stationary companion that acts as a physical extension an LLM can talk through. It listens, speaks, shows expressions on a color screen and follows a person's movement around the desk."
    ],
    built: [
      "Full-size ESP32 with a 2.7\" color TFT for expressions",
      "Microphone and speaker for voice conversation with an LLM",
      "Pip-style sensors to track a person's movement",
      "A single USB cable carries both power and data"
    ],
    parts: [
      ["Microcontroller", "ESP32 (full-size dev board)"],
      ["Display", "2.7\" color TFT"],
      ["Audio", "Microphone + speaker"],
      ["Link", "USB power + data"]
    ],
    challenges: [],
    gallery: []
  },

  /* ------------------------------------------------------------------ */
  {
    id: "watchbot",
    title: "Watchbot",
    status: "upcoming",
    tagline: "A smartwatch with a character named Bit living inside it.",
    cover: "",
    tags: ["ESP32", "Low Power", "Bluetooth", "CAD"],
    links: [],
    progress: "Concept",
    overview: [
      "Watchbot is a watch first: a wake animation and many selectable digital and analog faces. A dedicated button switches to Bit, an interactive character. After about a minute idle, Bit yawns and the watch drops into deep sleep."
    ],
    built: [
      "XIAO ESP32-S3 with a 0.96\" OLED and a small 3.7 V LiPo charged over USB",
      "Four buttons plus a sleep/wake slide switch",
      "Deep-sleep power management",
      "Planned Gadgetbridge Bluetooth sync for time and weather from Android"
    ],
    parts: [
      ["Microcontroller", "Seeed XIAO ESP32-S3"],
      ["Display", "0.96\" OLED"],
      ["Power", "3.7 V LiPo, USB charging"],
      ["Input", "4 buttons + slide switch"]
    ],
    challenges: [],
    gallery: []
  },

  /* ------------------------------------------------------------------ */
  {
    id: "hexbot",
    title: "Hexbot",
    status: "upcoming",
    tagline: "An 18-servo hexapod with inverse-kinematics gaits and a ToF 'HUD'.",
    cover: "",
    tags: ["Inverse Kinematics", "Servos", "PCA9685", "Sensors", "Web App"],
    links: [],
    progress: "Concept",
    overview: [
      "Hexbot is a six-legged walker with three servos per leg. Version 1 uses a standard inverse-kinematics gait, and terrain adaptation from foot-contact switches comes later."
    ],
    built: [
      "Full-size ESP32 driving 16 servos through a PCA9685 plus 2 directly from GPIO",
      "8×8 ToF sensor, IMU, larger OLED and microswitch foot-contact sensors",
      "Web app: walk/strafe stick, front-leg height to aim the ToF sensor, body height and tilt, live ToF HUD"
    ],
    parts: [
      ["Microcontroller", "ESP32 (full-size)"],
      ["Actuators", "18 servos (16 on PCA9685 + 2 direct)"],
      ["Sensors", "8×8 ToF, IMU, foot microswitches"],
      ["Display", "OLED"]
    ],
    challenges: [],
    gallery: []
  },

  /* ------------------------------------------------------------------ */
  {
    id: "dronebot",
    title: "Dronebot",
    status: "paused",
    tagline: "A brushed-motor ESP32 micro drone, paused in favor of Deskbot.",
    cover: "",
    tags: ["ESP32", "Flight Control"],
    links: [],
    progress: "Paused",
    overview: [
      "A small brushed-motor quadcopter with an ESP32 flight controller. I already fly BetaFPV micro FPV quads, and this project is about building the flight controller side myself. It's on hold while I build Deskbot."
    ],
    built: [],
    parts: [],
    challenges: [],
    gallery: [],
    hidden: false
  }

];
