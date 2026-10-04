/**
 * ============================================================
 *  ZAMYO — SITE CONTENT (bilingual: English / Arabic)
 * ============================================================
 * This is the ONLY file you should need to edit to update the
 * website's content. Components read from here — you shouldn't
 * need to touch JSX/CSS just to change text, links, or projects.
 *
 * Any field that appears as { en: "...", ar: "..." } is shown in
 * the matching language automatically — edit whichever language
 * you need, the other one is untouched. Fields that are NOT
 * split by language (project titles/descriptions, tool names,
 * company names, social platform names, email/WhatsApp) are
 * intentionally shared across both languages — proper nouns and
 * your own project copy shouldn't be auto-translated.
 *
 * Media (images/videos) live in /public and are referenced here
 * by path, e.g. "/portfolio/project-1.jpg". See README.md for
 * exact folder locations and recommended file formats/sizes.
 * ============================================================
 */

export const brand = {
  name: "ZAMYO", // Brand name — never translated.
  title: { en: "Video Editor | Content Creator", ar: "محرر فيديو | صانع محتوى" },
  location: { en: "Baghdad, Iraq", ar: "بغداد، العراق" },
  // Short line used in the browser tab / share previews.
  tagline: {
    en: "Short-form video editing and content creation.",
    ar: "مونتاج فيديوهات قصيرة وصناعة محتوى.",
  },
};

export const nav = {
  links: [
    { label: { en: "Work", ar: "الأعمال" }, href: "#work" },
    { label: { en: "Services", ar: "الخدمات" }, href: "#services" },
    { label: { en: "About", ar: "نبذة" }, href: "#about" },
    { label: { en: "Contact", ar: "تواصل" }, href: "#contact" },
  ],
  cta: { label: { en: "Let's talk", ar: "لنتحدث" }, href: "#contact" },
};

export const hero = {
  eyebrow: { en: "Video editor & content creator", ar: "محرر فيديو وصانع محتوى" },
  headline: {
    en: ["Video that", "gets watched,", "not scrolled past."],
    ar: ["فيديو", "يُشاهَد،", "لا يُتجاوَز."],
  },
  subtext: {
    en: "I cut short-form content that holds attention from the first frame — for creators, brands, and businesses who need their work to actually get seen.",
    ar: "أقوم بمونتاج محتوى قصير يشد الانتباه من اللقطة الأولى — لصنّاع المحتوى والعلامات التجارية والشركات التي تريد أن يُرى عملها فعلاً.",
  },
  primaryCta: { label: { en: "Contact me", ar: "تواصل معي" }, href: "#contact" },
  secondaryCta: { label: { en: "Watch showreel", ar: "شاهد العرض" }, href: "#showreel" },
  // Hero portrait — one photo. Recommended: 1200x1500 (portrait orientation), JPG or WEBP.
  portrait: { src: "/portfolio/hamza2.png", alt: "Portrait of ZAMYO" },
};

export const showreel = {
  heading: { en: "The showreel", ar: "العرض التقديمي" },
  subheading: {
    en: "A minute of the work speaks louder than a page of the pitch.",
    ar: "دقيقة من العمل تقول أكثر من صفحة كاملة من الكلام.",
  },
  // Replace with your real showreel file (mp4, ideally H.264, under ~15MB) or a hosted URL.
  video: {
    src: "/portfolio/Comp 1_10.mp4",
    poster: "/portfolio/showreel-poster.png",
  },
  duration: "0:11",
};

/**
 * Portfolio projects — edit, add, or remove entries here.
 * `thumb` / `video` are paths inside /public/portfolio/.
 * `video` is optional — if omitted, the thumbnail is shown as a static frame.
 *
 * title/category/description are shared across both languages on purpose
 * (client names and your own project copy — not auto-translated).
 */
export const projects = [
  {
    id: "midnight-drop",
    title: "awareness",
    category: "awareness",
    year: "2026",
    description: "H",
    thumb: "/portfolio/Screenshot 2026-09-24 232445.png",
    video: "/portfolio/awareness.mp4",
    ratio: "9 / 16",
  },
  {
    id: "athar",
    title: "dr.marwa-saeed",
    category: "doctor",
    year: "2026",
    description: "A",
    thumb: "/portfolio/Screenshot 2026-09-24 232653.png",
    video: "/portfolio/marwa salas final.mp4",
    ratio: "9 / 16",
  },
  {
    id: "eight-count",
    title: "al-mayyas",
    category: "clothing store",
    year: "2025",
    description: "M",
    thumb: "/portfolio/Screenshot 2026-09-24 232633.png",
    video: "/portfolio/mayas trousers final.mp4",
    ratio: "9 / 16",
  },
  {
    id: "field-notes",
    title: "dr.ruwaida al-saab",
    category: "little-AI-use",
    year: "2025",
    description: "Z",
    thumb: "/portfolio/Screenshot 2026-09-24 232607.png",
    video: "/portfolio/ruwaida monalisa ai final.mp4",
    ratio: "9 / 16",
  },
  {
    id: "launch-day",
    title: "Wisam",
    category: "Tajarib Podcast",
    year: "2025",
    description: "A",
    thumb: "/portfolio/Screenshot 2026-09-24 235357.png",
    video: "/portfolio/Copy of wasmi reel 3 final.mp4",
    ratio: "9 / 16",
  },
];

export const services = {
  heading: { en: "What I do", ar: "ماذا أقدّم" },
  primary: {
    label: { en: "Main focus", ar: "التركيز الأساسي" },
    title: { en: "Short-form video editing", ar: "مونتاج الفيديوهات القصيرة" },
    description: {
      en: "Reels, TikToks, and shorts cut to hold attention and built around how each platform actually gets watched. This is the work I take on most, and what I'm best at.",
      ar: "ريلز وتيك توك وفيديوهات قصيرة أقوم بمونتاجها لتشد الانتباه، مبنية على طريقة مشاهدة كل منصة فعليًا. هذا هو العمل الذي أتولاه غالبًا، وما أُجيده أكثر.",
    },
  },
  secondaryLabel: { en: "Also available", ar: "خدمات إضافية" },
  secondary: [
    {
      title: { en: "Long-form & professional editing", ar: "مونتاج احترافي وفيديوهات طويلة" },
      description: {
        en: "Full-length videos, YouTube content, and other edits beyond short-form.",
        ar: "فيديوهات كاملة، محتوى يوتيوب، ومونتاج آخر يتجاوز المحتوى القصير.",
      },
    },
    {
      title: { en: "Full content creation", ar: "صناعة محتوى متكاملة" },
      description: {
        en: "Concept, shoot, and edit handled start to finish, not just the editing pass.",
        ar: "من الفكرة إلى التصوير والمونتاج، من البداية للنهاية، وليس فقط مرحلة المونتاج.",
      },
    },
    {
      title: { en: "Filming", ar: "التصوير" },
      description: {
        en: "On location or in studio, when a project needs footage captured as well as cut.",
        ar: "في الموقع أو داخل الاستوديو، عندما يحتاج المشروع لتصوير اللقطات إلى جانب مونتاجها.",
      },
    },
    {
      title: { en: "Content strategy", ar: "استراتيجية المحتوى" },
      description: {
        en: "Planning a posting format or series, not just a one-off edit.",
        ar: "تخطيط شكل النشر أو سلسلة محتوى، وليس مجرد مونتاج لمرة واحدة.",
      },
    },
    {
      title: { en: "Creative support", ar: "دعم إبداعي" },
      description: {
        en: "Joining an existing team or workflow for a specific project or season.",
        ar: "الانضمام إلى فريق أو سير عمل قائم لمشروع أو موسم محدد.",
      },
    },
  ],
};

export const skills = {
  heading: { en: "Tools", ar: "الأدوات" },
  // Software names — never translated.
  tools: ["Adobe Premiere Pro", "Adobe After Effects", "DaVinci Resolve", "CapCut"],
};

export const clients = {
  heading: { en: "Companies worked with", ar: "تعاونت مع" },
  // Company names — never translated.
  names: ["Tajarib Podcast", "Blackshot Marketing Agency"],
};

export const about = {
  heading: { en: "About", ar: "نبذة" },
  paragraphs: [
    {
      en: "I'm the editor and creator behind ZAMYO — I cut short-form video for a living because I care about the half-second where someone decides to keep watching or scroll past.",
      ar: "أنا المونتير وصانع المحتوى وراء ZAMYO — أعمل في مونتاج الفيديوهات القصيرة لأنني أهتم بتلك اللحظة التي يقرر فيها المشاهد أن يستمر أو يتجاوز.",
    },
    {
      en: "Most projects start with editing, but I also film when a project needs it, from a single creator recording on their phone to a full same-day shoot.",
      ar: "تبدأ معظم المشاريع بالمونتاج، لكنني أقوم بالتصوير أيضًا عند الحاجة، من صانع محتوى يسجل بهاتفه إلى تصوير كامل في يوم واحد.",
    },
    {
      en: "Based in Baghdad and working with clients in Iraq and beyond, in person or fully remote.",
      ar: "أعمل من بغداد مع عملاء في العراق وخارجه، حضوريًا أو عن بُعد بالكامل.",
    },
  ],
};

// Its own small section, right after About. Each entry can optionally
// hold a real certificate file — drop the file in public/certificates/
// and point `file` at it (e.g. "/certificates/ielts.pdf"). Leave `file`
// as null for a credential with nothing to show yet (like an in-progress
// degree) and the card just won't render a "View certificate" link.
export const certificates = {
  heading: { en: "Certificates", ar: "الشهادات" },
  sectionLabel: { en: "Credentials", ar: "المؤهلات" },
  title: { en: "A couple of credentials, for the record.", ar: "بعض المؤهلات، للتوثيق." },
  viewLabel: { en: "View certificate", ar: "عرض الشهادة" },
  items: [
    {
      name: { en: "AI Software Engineering", ar: "هندسة برمجيات الذكاء الاصطناعي" },
      issuer: { en: "University of Technology — current student", ar: "الجامعة التكنولوجية — طالب حاليًا" },
      file: null,
    },
    {
      name: { en: "IELTS", ar: "آيلتس" },
      issuer: { en: "English proficiency certificate, Malaysia", ar: "شهادة كفاءة في اللغة الإنجليزية، ماليزيا" },
      file: "/certificates/IELTS_Test_Report_Form_cropped.pdf",
    },
  ],
};

export const contact = {
  heading: { en: "Let's make something worth watching.", ar: "لنصنع شيئًا يستحق المشاهدة." },
  subheading: {
    en: "Tell me about the project — what it's for, and what you already have to work with.",
    ar: "أخبرني عن مشروعك — ما الهدف منه، وما المتوفر لديك للعمل عليه.",
  },
  emailLabel: { en: "Email", ar: "البريد الإلكتروني" },
  email: "zamyoo66@gmail.com",
  whatsappLabel: { en: "WhatsApp", ar: "WhatsApp" },
  whatsapp: {
    // Digits only, with country code, no spaces or symbols.
    number: "+96407761664404",
    label: "+964 0776 166 4404",
  },
  // Platform names — never translated.
  social: [
    { label: "Instagram", icon: "instagram", href: "https://www.instagram.com/zamyoo6/?hl=en" },
    { label: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@zamyoo66" },
    { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@zamyo-6" },
  ],
  form: {
    // Formspree/Netlify Forms endpoint — see README.md to wire this up.
    action: "https://formspree.io/f/mqpawjwa",
    fields: {
      name: { en: "Name", ar: "الاسم" },
      email: { en: "Email", ar: "البريد الإلكتروني" },
      message: { en: "Tell me about the project", ar: "أخبرني عن مشروعك" },
      submit: { en: "Send message", ar: "إرسال الرسالة" },
    },
  },
};

export const workSection = {
  label: { en: "Selected work", ar: "أعمال مختارة" },
  heading: { en: "A few recent cuts.", ar: "مجموعة من أحدث الأعمال." },
  previewNote: {
    en: "Note: These are just previews. They are lower quality than the actual videos.",
    ar: "ملاحظة: هذه معاينات فقط، وجودتها أقل من الفيديوهات الفعلية.",
  },
};

export const ui = {
  openMenu: { en: "Open menu", ar: "فتح القائمة" },
  closeMenu: { en: "Close menu", ar: "إغلاق القائمة" },
  closeProject: { en: "Close project", ar: "إغلاق المشروع" },
  languageToggle: { en: "العربية", ar: "English" },
};

export const seo = {
  siteUrl: "https://zamyoportfolio.netlify.app/",
};
