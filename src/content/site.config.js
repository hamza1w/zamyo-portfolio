/**
 * ============================================================
 *  ZAMYO — SITE CONTENT
 * ============================================================
 * This is the ONLY file you should need to edit to update the
 * website's content. Components read from here — you shouldn't
 * need to touch JSX/CSS just to change text, links, or projects.
 *
 * Media (images/videos) live in /public and are referenced here
 * by path, e.g. "/portfolio/project-1.jpg". See README.md for
 * exact folder locations and recommended file formats/sizes.
 * ============================================================
 */

export const brand = {
  name: "ZAMYO",
  title: "Video Editor | Content Creator",
  location: "Baghdad, Iraq",
  // Short line used in the browser tab / share previews.
  tagline: "Short-form video editing and content creation.",
};

export const nav = {
  links: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  cta: { label: "Let's talk", href: "#contact" },
};

export const hero = {
  eyebrow: "Video editor & content creator",
  headline: ["Video that", "gets watched,", "not scrolled past."],
  subtext:
    "I cut short-form content that holds attention from the first frame — for creators, brands, and businesses who need their work to actually get seen.",
  primaryCta: { label: "Contact me", href: "#contact" },
  secondaryCta: { label: "Watch showreel", href: "#showreel" },
  /**
   * Portrait gallery — add as many as you like. On hover (or tap on
   * touch devices) the frame cycles through them. Recommended: 1200x1500
   * (portrait orientation), JPG or WEBP, all roughly the same crop so the
   * transition feels like one frame rather than a slideshow.
   */
  portraits: [
    { src: "/portfolio/hamza2.png", alt: "Portrait of ZAMYO" },
    { src: "/portfolio/qqqqq.png", alt: "ZAMYO on set" },
    { src: "/portfolio/Gemini_Generated_Image_gl4cv9gl4cv9gl4c.png", alt: "ZAMYO editing" },
  ],
};

export const showreel = {
  heading: "The showreel",
  subheading: "A minute of the work speaks louder than a page of the pitch.",
  // Replace with your real showreel file (mp4, ideally H.264, under ~15MB) or a hosted URL.
  video: {
    src: "/portfolio/Comp 1_10.mp4",
    poster: "/media/showreel-poster.jpg",
  },
  work: "0:11",
};

/**
 * Portfolio projects — edit, add, or remove entries here.
 * `thumb` / `video` are paths inside /public/portfolio/.
 * `video` is optional — if omitted, the thumbnail is shown as a static frame.
 */
export const projects = [
  {
    id: "midnight-drop",
    title: "awareness",
    category: "awareness",
    year: "2026",
    description:
      "H",
    thumb: "/portfolio/Screenshot 2026-09-24 232445.png",
    video: "/portfolio/awareness.mp4",
    ratio: "9 / 16",
  },
  {
    id: "athar",
    title: "dr.marwa-saeed",
    category: "doctor",
    year: "2026",
    description:
      "A",
    thumb: "/portfolio/Screenshot 2026-09-24 232653.png",
    video: "/portfolio/marwa salas final.mp4",
    ratio: "9 / 16",
  },
  {
    id: "eight-count",
    title: "al-mayyas",
    category: "clothing store",
    year: "2025",
    description:
      "M",
    thumb: "/portfolio/Screenshot 2026-09-24 232633.png",
    video: "/portfolio/mayas trousers final.mp4",
    ratio: "9 / 16",
  },
  {
    id: "field-notes",
    title: "dr.ruwaida al-saab",
    category: "little-AI-use",
    year: "2025",
    description:
      "Z",
    thumb: "/portfolio/Screenshot 2026-09-24 232607.png",
    video: "/portfolio/ruwaida monalisa ai final.mp4",
    ratio: "9 / 16",
  },
  {
    id: "launch-day",
    title: "Wisam",
    category: "Tajarib Podcast",
    year: "2025",
    description:
      "A",
    thumb: "/portfolio/Screenshot 2026-09-24 235357.png",
    video: "/portfolio/Copy of wasmi reel 3 final.mp4",
    ratio: "9 / 16",
  },
];

export const services = {
  heading: "What I do",
  primary: {
    label: "Main focus",
    title: "Short-form video editing",
    description:
      "Reels, TikToks, and shorts cut to hold attention and built around how each platform actually gets watched. This is the work I take on most, and what I'm best at.",
  },
  secondaryLabel: "Also available",
  secondary: [
    {
      title: "Long-form & professional editing",
      description: "Full-length videos, YouTube content, and other edits beyond short-form.",
    },
    {
      title: "Full content creation",
      description: "Concept, shoot, and edit handled start to finish, not just the editing pass.",
    },
    {
      title: "Filming",
      description: "On location or in studio, when a project needs footage captured as well as cut.",
    },
    {
      title: "Content strategy",
      description: "Planning a posting format or series, not just a one-off edit.",
    },
    {
      title: "Creative support",
      description: "Joining an existing team or workflow for a specific project or season.",
    },
  ],
};

export const skills = {
  heading: "Tools",
  tools: [
    "Adobe Premiere Pro",
    "Adobe After Effects",
    "DaVinci Resolve",
    "CapCut",
  ],
};

export const clients = {
  heading: "Companies Worked with",
  names: ["Tajarib Podcast", "Blackshot Marketing Agency"],
};

export const about = {
  heading: "About",
  paragraphs: [
    "I'm the editor and creator behind ZAMYO — I cut short-form video for a living because I care about the half-second where someone decides to keep watching or scroll past.",
    "Most projects start with editing, but I also film when a project needs it, from a single creator recording on their phone to a full same-day shoot.",
    "Based in Baghdad and working with clients in Iraq and beyond, in person or fully remote.",
  ],
};

export const contact = {
  heading: "Let's make something worth watching.",
  subheading:
    "Tell me about the project — what it's for, and what you already have to work with.",
  email: "zamyoo66@gmail.com",
  whatsapp: {
    // Digits only, with country code, no spaces or symbols.
    number: "+96407761664404",
    label: "+964 0776 166 4404",
  },
  social: [
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/zamyoo6/?hl=en" },
    { label: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@zamyoo66" },
    { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@zamyo-6" },
  ],
  form: {
    // Formspree/Netlify Forms endpoint — see README.md to wire this up.
    action: "https://formspree.io/f/your-form-id",
  },
};

export const seo = {
  siteUrl: "https://zamyo.example",
};
