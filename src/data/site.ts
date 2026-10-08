/* Personal details & site-wide copy. Edit here — every page reads from this file. */

export const site = {
  name: "Rajan Tarakhala",
  firstName: "Rajan",
  lastName: "Tarakhala",
  role: "2D / 3D Motion Artist",
  lede: "Character-driven animation, built frame by frame. I give characters their own way of moving — then let the story carry it.",

  /** ⚠ Replace with your real email before publishing. */
  email: "hello.rajan.t@gmail.com",

  /** Add links and they appear automatically in the footer and contact section.
   *  Example: { label: "Instagram", href: "https://instagram.com/yourhandle" } */
  socials: [] as { label: string; href: string }[],

  about: [
    "Hello, I'm Rajan Tarakhala — an artist passionate about the craft of character-driven 3D animation, focused on story development.",
    "I love observing characters, animating them, and giving each one a style of motion that's entirely their own.",
  ],

  skills: [
    "Motion videos",
    "3D animation",
    "VFX / tracking",
    "Rigging",
    "Modeling",
    "Sketching",
  ],

  /**
   * level: 0–1 (no longer drives the badge size — every badge is the same size now).
   * fit: icon width as a % of the badge. The icon files have different amounts of
   * transparent padding (Premiere / Blender fill their whole canvas, the others don't),
   * so each one is scaled so the VISIBLE artwork lands at the same size (~52% of the badge).
   */
  software: [
    { name: "After Effects", icon: "tools/after-effects", level: 0.9, fit: 73 },
    { name: "3ds Max", icon: "tools/3ds-max", level: 0.85, fit: 76 },
    { name: "Blender", icon: "tools/blender", level: 0.8, fit: 52 },
    { name: "Autodesk Maya", icon: "tools/maya", level: 0.95, fit: 68 },
    { name: "Premiere Pro", icon: "tools/premiere", level: 0.8, fit: 52 },
  ] as const,

  interests: ["Animated movies", "Music", "Travel", "Drawing"],

  contactLine: "Got a story that needs moving? Let's animate it.",
};