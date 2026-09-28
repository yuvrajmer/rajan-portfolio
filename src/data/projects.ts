import type { ImageKey } from "../assets";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export type Video = { url: string; title: string; thumb: ImageKey; src?: string };
export type Still = { key: ImageKey; alt: string };

export type MediaGroup =
  | { kind: "videos"; label?: string; items: Video[] }
  | { kind: "stills"; label: string; items: Still[] }
  | { kind: "logo-morph" };

export type Section = {
  title: string;
  body?: string[];
  list?: string[];
  media?: MediaGroup[];
  tools?: string[];
};

/** A tab on a project page — a year, or a workstream such as "Logo Reveal". */
export type Chapter = {
  id: string;
  tab: string;
  title: string;
  intro?: string[];
  sections: Section[];
};

export type Discipline =
  | "3D & CGI"
  | "VFX & tracking"
  | "Motion graphics"
  | "Social campaigns";

export type Project = {
  slug: string;
  name: string;
  shortName: string;
  logo: ImageKey;
  subtitle: string;
  years?: string;
  disciplines: Discipline[];
  cover: { key: ImageKey; position?: string };
  intro?: string[];
  tags?: string[];
  chapters: Chapter[];
};

export const DISCIPLINES: Discipline[] = [
  "3D & CGI",
  "VFX & tracking",
  "Motion graphics",
  "Social campaigns",
];

/* ------------------------------------------------------------------ */
/*  Small builders                                                     */
/* ------------------------------------------------------------------ */
/** Pass a 4th arg (a direct mp4/webm URL) to play a self-hosted file instead of the YouTube embed. */
const v = (url: string, title: string, thumb: ImageKey, src?: string): Video => ({ url, title, thumb, src });
const AE = "Adobe After Effects";
const PS = "Adobe Photoshop";
const AI = "Adobe Illustrator";

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */
export const projects: Project[] = [
  /* ============================ F1H2O ============================ */
  {
    slug: "f1h2o",
    name: "F1H2O World Championship",
    shortName: "F1H2O",
    logo: "logo/f1h2o",
    subtitle: "Digital creative work for the UIM F1H2O World Championship.",
    years: "2024 – 2025",
    disciplines: ["3D & CGI", "VFX & tracking", "Motion graphics", "Social campaigns"],
    cover: { key: "covers/f1h2o", position: "50% 55%" },
    chapters: [
      {
        id: "2024",
        tab: "2024",
        title: "F1H2O World Championship 2024 – Sharjah Grand Prix",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Worked on digital creative assets for the 2024 Road to Sharjah – Grand Prix of Sharjah, the season finale of the UIM F1H2O World Championship, held from 6–8 December 2024 at Khalid Lagoon, Sharjah, UAE.",
            ],
          },
          {
            title: "Hero Video",
            body: [
              "Created high-impact VFX sequences for the hero video, including a cinematic Earth scene and an asteroid impact/blast sequence, using advanced compositing and motion graphics to deliver a dramatic, action-packed visual experience.",
            ],
            media: [
              {
                kind: "videos",
                label: "Hero Video / Teaser",
                items: [v("https://youtu.be/VWXOezUiXt4", "Hero Video", "f1h2o/2024-hero")],
              },
            ],
            tools: ["Blender", AE, PS],
          },
          {
            title: "Promotional Video",
            body: [
              "Animated a horizontal LED screen promotional video featuring dynamic sports-style typography, motion graphics, and event information to create an engaging pre-event promotional experience.",
            ],
            media: [
              {
                kind: "videos",
                label: "LED Screen Promo",
                items: [v("https://youtu.be/Lmr2xqQCPoc", "Promo Video", "f1h2o/2024-led-promo")],
              },
            ],
          },
          {
            title: "Social Media Campaign",
            body: ["Created a complete set of animated social media creatives, including:"],
            list: [
              "Main promotional posts",
              "Multiple platform-specific size adaptations",
              "Countdown posts leading up to the event",
              "Branded visuals maintaining a consistent campaign identity",
            ],
            media: [
              {
                kind: "videos",
                label: "Social Media Assets",
                items: [
                  v("https://youtube.com/shorts/LKGUmymIBB8", "Social Media Post 01", "f1h2o/2024-social-1"),
                  v("https://youtube.com/shorts/pyBturEndr8", "Social Media Post 02", "f1h2o/2024-social-2"),
                ],
              },
            ],
          },
          {
            title: "Role & Contribution",
            body: [
              "Responsible for motion graphics, typography animation, and adapting creative assets for both digital displays and social media platforms.",
            ],
            tools: [AE, PS, AI],
          },
        ],
      },
      {
        id: "2025",
        tab: "2025",
        title: "F1H2O World Championship 2025 – Sharjah Grand Prix",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Contributed to the digital campaign for the 2025 Road to Sharjah – Grand Prix of Sharjah, where Victory Team claimed the teams' championship.",
            ],
          },
          {
            title: "Promotional Video",
            body: [
              "Animated a promotional video featuring dynamic motion graphics, sports-inspired typography, and event branding to build excitement for the championship.",
            ],
            media: [
              {
                kind: "videos",
                label: "Promo Video",
                items: [v("https://youtu.be/sU5LBn9SUI4", "2025 Promo Video", "f1h2o/2025-promo")],
              },
            ],
          },
          {
            title: "Social Media Campaign",
            body: ["Animated a range of social media creatives, including:"],
            list: [
              "Main promotional posts",
              "Platform-specific size adaptations",
              "Event announcement and promotional graphics",
              "Branded visuals aligned with the championship's visual identity",
            ],
            media: [
              {
                kind: "videos",
                label: "Social Media Assets",
                items: [
                  v("https://youtube.com/shorts/tEVxWrvgoyo", "Social Media Post 01", "f1h2o/2025-social-1"),
                  v("https://youtube.com/shorts/IBMyvozdpgs", "Social Media Post 02", "f1h2o/2025-social-2"),
                  v("https://youtube.com/shorts/o2EJtmWol7Q", "Social Media Post 03", "f1h2o/2025-social-3"),
                  v("https://youtube.com/shorts/OxhLamYQNYs", "Social Media Post 04", "f1h2o/2025-social-4"),
                ],
              },
            ],
          },
          {
            title: "Role & Contribution",
            body: [
              "Responsible for motion graphics, video editing, typography animation, and social media design, ensuring a consistent visual identity across digital platforms.",
            ],
          },
          { title: "Tools Used", tools: [AE, PS, AI] },
        ],
      },
    ],
  },

  /* ============================= SCTDA ============================ */
  {
    slug: "sctda",
    name: "SCTDA",
    shortName: "SCTDA",
    logo: "logo/sctda",
    subtitle: "Creative work for the Sharjah Commerce & Tourism Development Authority.",
    disciplines: ["3D & CGI", "Motion graphics", "Social campaigns"],
    cover: { key: "covers/sctda", position: "50% 50%" },
    chapters: [
      {
        id: "logo-reveal",
        tab: "Logo Reveal",
        title: "SCTDA Logo Reveal",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Created a logo reveal animation for SCTDA, transforming three static logo designs into a single, seamless visual journey through a custom-built animation concept.",
            ],
          },
          {
            title: "Creative Concept",
            body: [
              "Developed the entire transformation concept, designing smooth transitions that creatively morph one logo into the next while maintaining visual continuity and brand consistency.",
            ],
            media: [{ kind: "logo-morph" }],
          },
          {
            title: "Animation & Execution",
            body: [
              "Produced the complete logo reveal within 3–4 days, handling concept development, motion design, timing, and transition effects from start to finish.",
            ],
            media: [
              {
                kind: "videos",
                label: "Logo Reveal / Final Video",
                items: [v("https://youtu.be/M6LVXMy65d8", "SCTDA Logo Reveal", "sctda/logo-reveal")],
              },
            ],
          },
          {
            title: "Role & Contribution",
            body: [
              "Responsible for concept ideation, storyboard planning, transition design, motion graphics, and final animation.",
            ],
          },
          { title: "Tools Used", tools: [AE, AI, PS] },
        ],
      },
      {
        id: "social",
        tab: "Social Media",
        title: "Sharjah Commerce & Tourism Development Authority (SCTDA)",
        intro: [
          "The Sharjah Commerce & Tourism Development Authority (SCTDA) promotes Sharjah as a leading destination for tourism, culture, and business, highlighting the emirate\u2019s diverse experiences and contribution to the region\u2019s socio-economic growth.",
          "I have worked on multiple SCTDA campaigns, creating festival posts, social media content, and CGI shots for tourism promotional videos. My contributions included 3D CGI, motion graphics, visual effects, and creative social media adaptations to support various tourism and cultural initiatives.",
        ],
        sections: [
          {
            title: "Social Media Posts",
            media: [
              {
                kind: "videos",
                items: [
                  v("https://youtube.com/shorts/GVPOBJ97Uv0", "Sharjah National Day", "sctda/social-national-day"),
                  v("https://youtube.com/shorts/AaV6PF2QLzk", "Heerji New Year 2025", "sctda/social-heerji"),
                  v("https://youtube.com/shorts/HILR_3RfhTg", "Visit Sharjah Miami Vibes Story", "sctda/social-miami"),
                  v("https://youtube.com/shorts/ui0CfGZ1Isw", "Sharjah Tourism WTM London", "sctda/social-wtm"),
                ],
              },
            ],
          },
          {
            title: "Tourism Video",
            media: [
              {
                kind: "videos",
                label: "Get the License Out — Sharjah",
                items: [v("https://youtu.be/g5NwLQANK9s", "Get the License Out Sharjah", "sctda/tourism-license")],
              },
            ],
          },
          { title: "Tools Used", tools: ["3D CGI", AE, PS, AI] },
        ],
      },
    ],
  },

  /* ================== SHARJAH SUMMER PROMOTIONS =================== */
  {
    slug: "sharjah-summer-promotions",
    name: "Sharjah Summer Promotions",
    shortName: "Summer Promotions",
    logo: "logo/summer",
    subtitle: "Promotional campaign work for Sharjah Summer Promotions.",
    years: "2024 – 2026",
    disciplines: ["3D & CGI", "VFX & tracking", "Motion graphics", "Social campaigns"],
    cover: { key: "covers/summer-promotions", position: "50% 50%" },
    chapters: [
      {
        id: "2024",
        tab: "2024",
        title: "Sharjah Summer Promotions 2024",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Contributed to the Sharjah Summer Promotions 2024 campaign by creating a 3D CGI promotional video, delivering a visually engaging concept under a tight production schedule.",
            ],
          },
          {
            title: "3D CGI Video",
            body: [
              "Produced the first version of the video within just 2 days, transforming an initial concept into a fully animated promotional film.",
            ],
            media: [
              {
                kind: "videos",
                label: "CGI Video",
                items: [v("https://youtube.com/shorts/D_ZmKt5Ek3E", "CGI Video", "summer/2024-cgi")],
              },
            ],
          },
          {
            title: "Creative & Technical Execution",
            body: ["Managed the complete production pipeline, including:"],
            list: [
              "3D model creation and asset preparation",
              "Location-based animation and scene composition",
              "Camera tracking and compositing",
              "Custom logo reveal animation",
              "Lighting, rendering, and final post-production",
            ],
            media: [
              {
                kind: "stills",
                label: "Making of",
                items: [
                  { key: "summer/2024-location-1", alt: "Location reference 01" },
                  { key: "summer/2024-location-2", alt: "Location reference 02" },
                  { key: "summer/2024-assets-1", alt: "3D asset models 01" },
                  { key: "summer/2024-assets-2", alt: "3D asset models 02" },
                  { key: "summer/2024-assets-3", alt: "3D asset models 03" },
                ],
              },
            ],
          },
          {
            title: "Challenges",
            body: [
              "Successfully delivered the project under a highly demanding timeline, overcoming technical challenges in 3D production, animation, tracking, and visual integration while maintaining quality and meeting deadlines.",
            ],
          },
          {
            title: "Role & Contribution",
            body: [
              "Responsible for concept development, 3D animation, CGI production, motion graphics, compositing, tracking, logo reveal animation, and final video delivery.",
            ],
          },
          { title: "Tools Used", tools: ["Blender", AE, PS, AI] },
        ],
      },
      {
        id: "2026",
        tab: "2026",
        title: "Sharjah Summer Promotions 2026",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Contributed to the Sharjah Summer Promotions 2025 campaign by creating motion graphics, promotional content, and multilingual digital assets for the event.",
            ],
          },
          {
            title: "Hero Video",
            body: [
              "Worked on several hero video sequences, including phone tracking, motion graphics, and animated promotional clips, ensuring seamless visual integration and high production quality. Adapted motion graphics and video assets into multiple languages, maintaining consistent branding and accurate layout across all localized versions.",
            ],
            media: [
              {
                kind: "videos",
                label: "Hero Video",
                items: [v("https://youtu.be/VJtsdnsz3nQ", "2026 Hero Video", "summer/2026-hero")],
              },
            ],
          },
          {
            title: "Infographic Videos",
            body: [
              "Created engaging animated infographic videos to communicate promotional offers and campaign information in a clear, visually appealing format.",
            ],
            media: [
              {
                kind: "videos",
                label: "Info Graphic",
                items: [v("https://youtube.com/shorts/RMSNSUOR4Rk", "Info Graphic Video", "summer/2026-infographic")],
              },
            ],
          },
          {
            title: "Social Media Campaign",
            body: ["Animated a complete social media campaign in two languages, including main promotional posts."],
            media: [
              {
                kind: "videos",
                label: "Social Media Assets",
                items: [
                  v("https://youtube.com/shorts/CX5F1kKra6g", "Social Media Post 01", "summer/2026-social-1"),
                  v("https://youtube.com/shorts/oQuk_hkC4lI", "Social Media Post 02", "summer/2026-social-2"),
                  v("https://youtube.com/shorts/aNlIaeu9Stc", "Social Media Post 03", "summer/2026-social-3"),
                  v("https://youtube.com/shorts/rU63nuv9tWg", "Social Media Post 04", "summer/2026-social-4"),
                ],
              },
            ],
          },
          {
            title: "Role & Contribution",
            body: [
              "Responsible for motion graphics, phone tracking, multilingual video adaptation, social media design, infographic animation, and final asset delivery across multiple digital platforms.",
            ],
          },
          { title: "Tools Used", tools: [AE, PS, AI] },
        ],
      },
    ],
  },

  /* ====================== SHARJAH WEEK OF STARS =================== */
  {
    slug: "sharjah-week-of-stars",
    name: "Sharjah Week of Stars",
    shortName: "Week of Stars",
    logo: "logo/wos",
    subtitle: "Creative campaign work for Sharjah's Week of Stars.",
    years: "2024 – 2025",
    disciplines: ["Motion graphics", "Social campaigns"],
    cover: { key: "covers/week-of-stars", position: "50% 50%" },
    chapters: [
      {
        id: "2024",
        tab: "2024",
        title: "Sharjah Week of Stars 2024",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Contributed to the creative campaign for Sharjah Week of Stars 2024, held from 9–14 January 2024. Organized by the Sharjah Commerce and Tourism Development Authority (SCTDA), the event featured the Night of the Stars, Legends Padel Tour, and Sharjah International Footgolf Tournament, bringing together more than 23 international football legends across iconic locations in Sharjah.",
            ],
          },
          {
            title: "Key Visual (KV) Animation",
            body: [
              "Animated the official Key Visual (KV) in multiple resolutions and aspect ratios, ensuring seamless adaptation for various digital platforms and display formats.",
            ],
            media: [
              {
                kind: "videos",
                label: "KV Animation",
                items: [v("https://youtube.com/shorts/h7CW_rLRD-I", "KV Animation", "wos/2024-kv")],
              },
            ],
          },
          {
            title: "Promotional Videos",
            body: [
              "Created engaging promotional videos featuring motion graphics, animated typography, and event branding to enhance the campaign's visual impact.",
            ],
            media: [
              {
                kind: "videos",
                label: "Promotional Videos",
                items: [
                  v("https://youtube.com/shorts/W-28ZEhU5gE", "Player Greetings", "wos/2024-player-greetings"),
                  v("https://youtube.com/shorts/4CbEa-9hMwE", "WOS Teaser", "wos/2024-teaser"),
                ],
              },
            ],
          },
          {
            title: "Social Media Campaign",
            body: ["Animated a complete set of social media creatives, including:"],
            list: [
              "Main promotional posts",
              "Platform-specific size adaptations",
              "Event announcement and campaign visuals",
            ],
          },
          {
            title: "Role & Contribution",
            body: ["Responsible for KV animation, motion graphics, promotional video production."],
          },
          { title: "Tools Used", tools: [AE, PS, AI] },
        ],
      },
      {
        id: "2025",
        tab: "2025",
        title: "Sharjah Week of Stars 2025",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Contributed to the creative campaign for Sharjah Week of Stars 2025, producing engaging digital content to promote the event and celebrate the participation of international football legends.",
            ],
          },
          {
            title: "Main Promotional Video",
            body: [
              "Animated the main campaign video, combining motion graphics and event branding to create a visually compelling promotional piece.",
            ],
          },
          {
            title: "Social Media Campaign",
            body: ["Animated a complete set of social media creatives, including:"],
            list: [
              "Main promotional posts",
              "Platform-specific size adaptations",
              "Event announcement and branded campaign visuals",
            ],
            media: [
              {
                kind: "videos",
                label: "Social Media Assets",
                items: [
                  v("https://youtube.com/shorts/Br4cJuyv0ac", "Social Media Post 01", "wos/2025-social-1"),
                  v("https://youtube.com/shorts/Yh6xrxyWAH0", "Social Media Post 02", "wos/2025-social-2"),
                ],
              },
            ],
          },
          {
            title: "Player Greeting Reels",
            body: [
              "Produced personalized player greeting reels featuring custom motion graphics, animated text, and event branding for participating football legends, optimized for social media engagement.",
            ],
            media: [
              {
                kind: "videos",
                label: "Player Greetings",
                items: [
                  v("https://youtube.com/shorts/zPnJuerKxrc", "Player Greeting 01", "wos/2025-greeting-1"),
                  v("https://youtube.com/shorts/b-gWr7mb7Pk", "Player Greeting 02", "wos/2025-greeting-2"),
                ],
              },
            ],
          },
          {
            title: "Role & Contribution",
            body: ["Responsible for motion graphics, and delivering creative assets across multiple digital platforms."],
          },
          { title: "Tools Used", tools: [AE, PS, AI] },
        ],
      },
    ],
  },

  /* ============================ CONTINENTAL ======================== */
  {
    slug: "continental",
    name: "Continental",
    shortName: "Continental",
    logo: "logo/continental",
    subtitle: "CGI promotional videos and social content for Continental Tyres.",
    years: "2024",
    disciplines: ["3D & CGI", "VFX & tracking", "Motion graphics", "Social campaigns"],
    cover: { key: "continental/cgi-truck", position: "48% 60%" },
    intro: [
      "Continental is a global tyre and technology brand. I contributed to a series of CGI promotional videos combining 3D elements with live-action footage to create visually engaging marketing content, alongside social media motion content for the brand's 2024 event activations.",
    ],
    tags: ["CGI", "3D Animation", "Social Campaign"],
    chapters: [
      {
        id: "cgi",
        tab: "CGI",
        title: "Continental \u2013 CGI Video Projects",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Contributed to multiple CGI promotional videos for Continental, combining 3D elements with live-action footage to create visually engaging marketing content.",
            ],
          },
          {
            title: "3D Integration & VFX",
            body: [
              "Worked on model placement, camera tracking, lighting, animation, and compositing to ensure seamless integration of CGI elements with live-action footage.",
            ],
          },
          {
            title: "Project Showcase",
            list: [
              "Balls Falling \u2013 volleyball event promotion",
              "Grass Grow \u2013 concept of the brand using green electricity",
              "Tyre in Different Locations \u2013 concept of the brand's reach across the Middle East",
              "Carpet Animation \u2013 giving the brand a royal touch",
              "Truck with Big Size Elements \u2013 engineered for safety and performance",
            ],
            media: [
              {
                kind: "videos",
                label: "CGI Showcase",
                items: [
                  v("https://youtube.com/shorts/H1hCt-5ovQY", "Balls Falling CGI", "continental/cgi-balls-falling"),
                  v("https://youtube.com/shorts/kEcqZBEAj38", "Grass Grow CGI", "continental/cgi-grass-grow"),
                  v("https://youtube.com/shorts/tyeIhjvdxPo", "Tyre in Different Locations", "continental/cgi-tyre-locations"),
                  v("https://youtube.com/shorts/iwjVJVteLkM", "Carpet Animation", "continental/cgi-carpet"),
                  v("https://youtube.com/shorts/pFi-e18d_xA", "Truck with Big Size Elements", "continental/cgi-truck"),
                ],
              },
            ],
          },
          {
            title: "Role & Contribution",
            body: ["Responsible for CGI animation, camera tracking, motion graphics, compositing, and final video production."],
          },
          { title: "Tools Used", tools: ["Blender", AE, PS] },
        ],
      },
      {
        id: "sm",
        tab: "Social",
        title: "Social Media \u2013 2024 Events",
        sections: [
          {
            title: "2024 Events Reel",
            body: ["Concept and animation for a social media reel promoting Continental's 2024 event presence."],
            media: [
              {
                kind: "videos",
                label: "Social Media",
                items: [v("https://youtube.com/shorts/mNXWpDdDsQM", "2024 Events Reel", "continental/sm-2024-events")],
              },
            ],
          },
        ],
      },
    ],
  },

  /* =========================== VISIT SHARJAH ====================== */
  {
    slug: "visit-sharjah",
    name: "Visit Sharjah",
    shortName: "Visit Sharjah",
    logo: "logo/visit-sharjah",
    subtitle: "A look at the animation and motion work created for Visit Sharjah.",
    disciplines: ["3D & CGI", "Motion graphics"],
    cover: { key: "sctda/social-miami", position: "50% 62%" },
    intro: [
      "Visit Sharjah is the official tourism platform promoting Sharjah\u2019s cultural experiences, heritage, nature, family activities, festivals, and attractions. Through engaging visual campaigns and digital content, the brand showcases Sharjah as a diverse and vibrant tourism destination.",
      "I have worked on multiple Visit Sharjah campaigns, contributing to visual communication and digital content that promotes Sharjah\u2019s destinations, experiences, events, and tourism offerings.",
    ],
    tags: ["Motion Design", "3D Animation", "Tourism Campaign"],
    chapters: [],
  },

  /* ============================== SHUROOQ ========================= */
  {
    slug: "shurooq",
    name: "Shurooq",
    shortName: "Shurooq",
    logo: "logo/shurooq",
    subtitle: "Promotional travel content for the Sharjah Investment and Development Authority.",
    years: "2024 – 2026",
    disciplines: ["3D & CGI", "VFX & tracking", "Motion graphics", "Social campaigns"],
    cover: { key: "covers/shurooq", position: "50% 50%" },
    chapters: [
      {
        id: "2024",
        tab: "2024",
        title: "Sharjah Summer Shurooq 2024",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Contributed to the Sharjah Shurooq 2024 campaign by creating promotional travel videos showcasing four of Sharjah's beach destinations, highlighting their attractions through engaging motion graphics and VFX.",
            ],
          },
          {
            title: "Creative Concept",
            body: [
              "Developed a visual storytelling concept that guided viewers through four beach locations, integrating travel and food-themed elements to enhance the overall tourism experience.",
            ],
          },
          {
            title: "VFX & Motion Graphics",
            body: [
              "Performed 2D motion tracking and compositing, seamlessly integrating animated elements into live-action footage to create an immersive visual experience.",
            ],
            media: [
              {
                kind: "videos",
                label: "Hero Videos",
                items: [
                  v("https://youtu.be/DL0VHAHDmm0", "Hero Video 01", "shurooq/2024-hero-1"),
                  v("https://youtu.be/hj23qkL1k3o", "Hero Video 02", "shurooq/2024-hero-2"),
                ],
              },
            ],
          },
          {
            title: "Role & Contribution",
            body: ["Responsible for motion tracking, VFX compositing, motion graphics, and final video production."],
          },
          { title: "Tools Used", tools: [AE, PS, AI] },
        ],
      },
      {
        id: "2025",
        tab: "2025",
        title: "Sharjah Summer Shurooq 2025",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Contributed to the Sharjah Shurooq 2025 campaign by producing the hero video, explainer videos, and a large-scale social media campaign promoting Sharjah's tourist destinations.",
            ],
          },
          {
            title: "Hero Video",
            body: [
              "Developed the concept for a pixel-inspired animation style, where each destination featured custom 3D animated elements. Collaborated with a senior artist to create and animate food items and other 3D models in Blender, while emoji animations were produced by another team member.",
            ],
            media: [
              {
                kind: "stills",
                label: "Making of",
                items: [
                  { key: "shurooq/2025-making-1", alt: "Hero video making-of 01" },
                  { key: "shurooq/2025-making-2", alt: "Hero video making-of 02" },
                  { key: "shurooq/2025-making-3", alt: "Hero video making-of 03" },
                  { key: "shurooq/2025-making-icons", alt: "Hero video 3D icon assets" },
                  { key: "shurooq/2025-making-5", alt: "Hero video making-of 05" },
                ],
              },
              {
                kind: "videos",
                label: "Hero Video",
                items: [v("https://youtu.be/BN3qy7slFV4", "2025 Hero Video", "shurooq/2025-hero")],
              },
            ],
          },
          {
            title: "Explainer Motion Videos",
            body: [
              "Produced two animated explainer videos in Adobe After Effects, using motion graphics, typography, and icon animations to communicate key information in a visually engaging format.",
            ],
            media: [
              {
                kind: "videos",
                label: "Explainer Videos",
                items: [
                  v("https://youtu.be/pEx1ZhnqhEk", "Explainer Al Heera", "shurooq/2025-explainer-heera"),
                  v("https://youtu.be/VoDNjHaiytA", "Explainer Khorfakkan", "shurooq/2025-explainer-khorfakkan"),
                ],
              },
              {
                kind: "videos",
                label: "Al Heera 2D VFX",
                items: [v("https://youtube.com/shorts/LWFjMcYbeZI", "Al Heera 2D VFX", "shurooq/2025-heera-vfx")],
              },
            ],
          },
          {
            title: "Social Media Campaign",
            body: ["Executed a 15-day campaign, delivering two reels per day along with creative social media posts."],
            media: [
              {
                kind: "videos",
                label: "Social Media Assets",
                items: [
                  v("https://youtube.com/shorts/GOv0wpW-XVo", "Social Media Post 01", "shurooq/2025-social-1"),
                  v("https://youtube.com/shorts/gkijqY32T7U", "Social Media Post 02", "shurooq/2025-social-2"),
                  v("https://youtube.com/shorts/qse78UKW3F0", "Social Media Post 03", "shurooq/2025-social-3"),
                  v("https://youtube.com/shorts/4AadeJfjcAY", "Social Media Post 04", "shurooq/2025-social-4"),
                ],
              },
            ],
          },
          {
            title: "Motion Graphics & 3D Integration",
            body: [
              "Added and animated consistent branded elements across all reels using Adobe After Effects and Blender, ensuring a cohesive visual identity throughout the campaign.",
            ],
          },
          {
            title: "Role & Contribution",
            body: [
              "Responsible for hero video 3D animation, motion graphics, explainer video production, social media reel creation, and integrating visual elements across multiple digital formats.",
            ],
          },
          { title: "Tools Used", tools: ["Blender", AE, PS, AI] },
        ],
      },
      {
        id: "2026",
        tab: "2026",
        title: "Shurooq Ramadan Campaign 2026",
        sections: [
          {
            title: "Project Overview",
            body: [
              "Contributed to the Shurooq Ramadan Campaign, producing creative assets for the hero video and an extensive social media campaign to promote Ramadan experiences across Shurooq destinations.",
            ],
          },
          {
            title: "Hero Video",
            body: ["Enhanced the hero video by adding motion graphics, animated typography, ensuring a polished and engaging final output."],
            media: [
              {
                kind: "videos",
                label: "Hero Video",
                items: [v("https://youtube.com/shorts/t-x9jRW_x7s", "2026 Hero Video", "shurooq/2026-hero")],
              },
            ],
          },
          {
            title: "Social Media Campaign",
            body: [
              "Executed a 15-day social media campaign, producing 2 reels per day across two different creative themes to maintain content variety and audience engagement. Also designed supporting campaign posts with a consistent visual identity.",
            ],
            media: [
              {
                kind: "videos",
                label: "Social Media Assets",
                items: [
                  v("https://youtube.com/shorts/_fF-gNs-yv0", "Social Media Video 01", "shurooq/2026-social-1"),
                  v("https://youtube.com/shorts/xxWT7DHvd68", "Social Media Video 02", "shurooq/2026-social-2"),
                  v("https://youtube.com/shorts/aQr-XowyELA", "Social Media Video 03", "shurooq/2026-social-3"),
                ],
              },
            ],
          },
          {
            title: "Role & Contribution",
            body: ["Responsible for hero video enhancements - motion graphics, reel production throughout the campaign."],
          },
          { title: "Tools Used", tools: [AE, PS, AI] },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/**
 * Visit Sharjah is an umbrella client relationship — these five campaigns
 * were all delivered under it. Continental (and any other client added
 * later) is its own standalone relationship with no siblings. This is the
 * single source of truth for that grouping — every component that needs to
 * know "what else belongs with this project" reads it from here.
 */
export const VISIT_SHARJAH_CAMPAIGNS = [
  "f1h2o",
  "shurooq",
  "sharjah-summer-promotions",
  "sharjah-week-of-stars",
  "sctda",
] as const;

/** Campaigns in VISIT_SHARJAH_CAMPAIGNS order (the array above drives display order). */
const visitSharjahCampaigns = (): Project[] =>
  VISIT_SHARJAH_CAMPAIGNS.map(getProject).filter((p): p is Project => Boolean(p));

/** Sibling campaigns for a project's page — empty for standalone clients. */
export const siblingsOf = (slug: string): Project[] => {
  if (slug === "visit-sharjah" || (VISIT_SHARJAH_CAMPAIGNS as readonly string[]).includes(slug)) {
    return visitSharjahCampaigns().filter((p) => p.slug !== slug);
  }
  return [];
};

/**
 * Companies (top-level clients), in display order — the Works page lists all of
 * them, the home page shows the first HOME_CLIENT_LIMIT. To add a company:
 * add its project above, then put its slug here. (Campaigns delivered under a
 * company, like F1H2O under Visit Sharjah, stay out of this list.)
 */
export const CLIENT_SLUGS = ["visit-sharjah", "continental"] as const;
export const clients: Project[] = CLIENT_SLUGS.map(getProject).filter((p): p is Project => Boolean(p));

/** How many companies the home page "Selected work" section shows. */
export const HOME_CLIENT_LIMIT = 6;

/** Campaigns delivered under a company — empty for standalone clients. */
export const campaignsOf = (p: Project): Project[] =>
  p.slug === "visit-sharjah" ? visitSharjahCampaigns() : [];

/** A company's own work plus everything delivered under it. */
export const clientVideoCount = (p: Project) =>
  campaignsOf(p).reduce((n, c) => n + videoCount(c), videoCount(p));

export const clientDisciplines = (p: Project): Discipline[] => {
  const all = [p, ...campaignsOf(p)];
  return DISCIPLINES.filter((d) => all.some((x) => x.disciplines.includes(d)));
};

export const chapterVideos = (c: Chapter): Video[] =>
  c.sections.flatMap((s) =>
    (s.media ?? []).flatMap((m) => (m.kind === "videos" ? m.items : []))
  );

export const videoCount = (p: Project) =>
  p.chapters.reduce((n, c) => n + chapterVideos(c).length, 0);

export const totalVideos = () => projects.reduce((n, p) => n + videoCount(p), 0);

export const neighbours = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
};