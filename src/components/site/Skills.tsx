import { Reveal } from "./Reveal";

// Inline SVG logos — no external deps
const Logo = {
  python: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.89S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.031v-2.867s-.109-3.403 3.347-3.403h5.765s3.236.052 3.236-3.127V3.107S18.28 0 11.914 0zm-3.2 1.799a1.047 1.047 0 1 1 0 2.094 1.047 1.047 0 0 1 0-2.094z" fill="#3776AB"/>
      <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H12v-.826h8.131S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.031v2.867s.109 3.403-3.347 3.403H9.454s-3.236-.052-3.236 3.127v5.325S5.72 24 12.086 24zm3.2-1.799a1.047 1.047 0 1 1 0-2.094 1.047 1.047 0 0 1 0 2.094z" fill="#FFD43B"/>
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="2" fill="#F7DF1E"/>
      <path d="M6.5 18.5c.4.7 1 1.2 2 1.2 1.1 0 1.7-.5 1.7-1.3 0-.9-.7-1.2-1.8-1.7l-.6-.3c-1.8-.8-3-1.7-3-3.7 0-1.8 1.4-3.2 3.5-3.2 1.5 0 2.6.5 3.4 1.9l-1.8 1.2c-.4-.7-.8-1-1.5-1-.7 0-1.1.4-1.1 1 0 .7.4 1 1.5 1.5l.6.3c2.1.9 3.3 1.8 3.3 3.9 0 2.2-1.7 3.4-4 3.4-2.2 0-3.7-1.1-4.4-2.5l1.9-1.1zm9.5.2c.5.8 1 1.4 2 1.4.9 0 1.5-.4 1.5-2V9.8h2.3v8.4c0 3.2-1.9 4.7-4.6 4.7-2.5 0-3.9-1.3-4.6-2.8l2.4-1.4z" fill="#000"/>
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="2" fill="#3178C6"/>
      <path d="M13.5 12.5H11v7h-2v-7H6.5v-2h7v2zm1.5 5.5c.4.3.9.5 1.5.5.7 0 1.2-.3 1.2-.8 0-.5-.3-.8-1.2-1.1l-.5-.2c-1.3-.5-2-1.2-2-2.4 0-1.3 1-2.2 2.6-2.2 1 0 1.8.3 2.4 1l-1 1.2c-.4-.4-.8-.6-1.3-.6-.6 0-.9.3-.9.7 0 .5.3.7 1.1 1l.5.2c1.4.5 2.1 1.3 2.1 2.5 0 1.5-1.1 2.4-2.9 2.4-1.1 0-2.1-.4-2.8-1.1l1.2-1.1z" fill="#fff"/>
    </svg>
  ),
  react: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="12" r="2.05" fill="#61DAFB"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="3.8" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
    </svg>
  ),
  nextjs: (
    <svg viewBox="0 0 24 24" className="size-full" fill="currentColor">
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0z"/>
    </svg>
  ),
  fastapi: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="12" r="12" fill="#009688"/>
      <path d="M12.5 3L5 13.5h7L11 21l8-10.5h-7L12.5 3z" fill="#fff"/>
    </svg>
  ),
  postgresql: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path d="M17.13 14.83c-.14.77-.4 1.5-.77 2.16-.5.9-1.1 1.35-1.7 1.35-.28 0-.7-.1-1.26-.3-.56-.2-1.05-.3-1.47-.3-.4 0-.87.1-1.4.3-.54.2-.97.3-1.3.3-.65 0-1.28-.47-1.88-1.4-.6-.94-.9-2.02-.9-3.24 0-1.17.28-2.13.84-2.88.56-.75 1.27-1.12 2.13-1.12.38 0 .87.08 1.47.24.6.16 1 .24 1.2.24.17 0 .57-.09 1.2-.27.63-.18 1.16-.27 1.6-.27.56 0 1.06.15 1.5.45.44.3.8.73 1.08 1.3-.47.28-.82.6-1.05.97-.23.37-.35.8-.35 1.28 0 .5.13.95.4 1.35.27.4.6.67 1 .8l-.34.04z" fill="#336791"/>
      <path d="M14.5 3.5c.1.7-.1 1.4-.6 2.1-.5.7-1.1 1.1-1.8 1.05-.1-.65.1-1.35.55-2.05.45-.7 1.1-1.1 1.85-1.1z" fill="#336791"/>
    </svg>
  ),
  tensorflow: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zM22.708 8.117l-6.168-3.564v13.02L12.46 20V0l10.248 5.856v2.26z" fill="#FF6F00"/>
    </svg>
  ),
  scikitlearn: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="12" r="11" fill="#F7931E"/>
      <path d="M7 12.5c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z" fill="#fff"/>
      <path d="M9.5 12.5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5z" fill="#3499CD"/>
    </svg>
  ),
  pandas: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect x="3" y="2" width="4" height="20" rx="2" fill="#150458"/>
      <rect x="10" y="2" width="4" height="20" rx="2" fill="#E70488"/>
      <rect x="17" y="2" width="4" height="20" rx="2" fill="#150458"/>
      <rect x="3" y="9" width="18" height="4" rx="1" fill="#150458" opacity=".4"/>
    </svg>
  ),
  opencv: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="5" r="4" fill="#5C3EE8"/>
      <circle cx="5" cy="17" r="4" fill="#E8433C"/>
      <circle cx="19" cy="17" r="4" fill="#4CAF50"/>
    </svg>
  ),
  git: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 1 1-1.1 1.04l-2.48-2.48v6.511a1.84 1.84 0 1 1-1.512-.036V9.227a1.84 1.84 0 0 1-.999-2.416L7.614 4.16 .45 11.32a1.55 1.55 0 0 0 0 2.189l10.48 10.477a1.55 1.55 0 0 0 2.187 0l10.43-10.43a1.55 1.55 0 0 0 0-2.187" fill="#F05032"/>
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path d="M13.5 9h2v2h-2V9zm-3 0h2v2h-2V9zm-3 0h2v2H7.5V9zm3-3h2v2h-2V6zm3 0h2v2h-2V6zm3 3h2v2h-2V9z" fill="#2496ED"/>
      <path d="M22.5 10.5c-.5-.3-1.6-.4-2.5-.2-.1-.9-.7-1.7-1.7-2.2l-.6-.3-.3.6c-.4.7-.5 1.8-.1 2.6-.6.3-1.2.4-1.8.4H1.5c-.3 1.3 0 3 1 4.2.9 1.1 2.3 1.7 4.1 1.7 3.9 0 6.8-1.8 8.2-5h.7c1.4 0 2.3-.6 2.8-1.7.2-.3.3-.7.4-1.1h-.2z" fill="#2496ED"/>
    </svg>
  ),
  linux: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path d="M12 1C8.5 1 6 4 6 7.5c0 1.5.4 2.8 1 3.8L5.5 14c-.5 1 0 2 1 2.5l1 .5c0 1 .5 2 1.5 2.5l3 1.5 3-1.5c1-.5 1.5-1.5 1.5-2.5l1-.5c1-.5 1.5-1.5 1-2.5l-1.5-2.7c.6-1 1-2.3 1-3.8C18 4 15.5 1 12 1z" fill="#FCC624"/>
      <circle cx="9.5" cy="8" r="1" fill="#000"/>
      <circle cx="14.5" cy="8" r="1" fill="#000"/>
      <path d="M10 11c.5.7 1.5.7 2 0" stroke="#000" strokeWidth=".8" fill="none"/>
    </svg>
  ),
  twilio: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="12" r="11" fill="#F22F46"/>
      <circle cx="8.5" cy="8.5" r="2" fill="#fff"/>
      <circle cx="15.5" cy="8.5" r="2" fill="#fff"/>
      <circle cx="8.5" cy="15.5" r="2" fill="#fff"/>
      <circle cx="15.5" cy="15.5" r="2" fill="#fff"/>
    </svg>
  ),
  gemini: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="url(#gem-grad)"/>
      <path d="M12 5c0 3.87-3.13 7-7 7 3.87 0 7 3.13 7 7 0-3.87 3.13-7 7-7-3.87 0-7-3.13-7-7z" fill="#fff"/>
      <defs>
        <linearGradient id="gem-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4285F4"/>
          <stop offset=".5" stopColor="#9B72CB"/>
          <stop offset="1" stopColor="#D96570"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  xgboost: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="4" fill="#189AB4"/>
      <path d="M5 19L9.5 5h2L7 19H5zm8 0L17.5 5h2L13 19h-2zm-4-7h6" stroke="#fff" strokeWidth="1.5" fill="none"/>
    </svg>
  ),
  aes: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="4" fill="#2D3748"/>
      <rect x="4" y="10" width="16" height="10" rx="2" fill="#4A5568"/>
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#68D391" strokeWidth="1.5" fill="none"/>
      <circle cx="12" cy="15" r="2" fill="#68D391"/>
    </svg>
  ),
};

type Skill = { name: string; logo: keyof typeof Logo };

const categories: { title: string; eyebrow: string; skills: Skill[] }[] = [
  {
    title: "Languages",
    eyebrow: "Core",
    skills: [
      { name: "Python", logo: "python" },
      { name: "JavaScript", logo: "javascript" },
      { name: "TypeScript", logo: "typescript" },
    ],
  },
  {
    title: "Frontend & Backend",
    eyebrow: "Frameworks",
    skills: [
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "nextjs" },
      { name: "FastAPI", logo: "fastapi" },
      { name: "PostgreSQL", logo: "postgresql" },
    ],
  },
  {
    title: "AI & Data Science",
    eyebrow: "ML / AI",
    skills: [
      { name: "TensorFlow", logo: "tensorflow" },
      { name: "Scikit-learn", logo: "scikitlearn" },
      { name: "Pandas", logo: "pandas" },
      { name: "OpenCV", logo: "opencv" },
      { name: "XGBoost", logo: "xgboost" },
      { name: "Gemini API", logo: "gemini" },
    ],
  },
  {
    title: "Tools & Infra",
    eyebrow: "DevOps",
    skills: [
      { name: "Git", logo: "git" },
      { name: "Docker", logo: "docker" },
      { name: "Linux", logo: "linux" },
      { name: "Twilio", logo: "twilio" },
      { name: "AES-256", logo: "aes" },
    ],
  },
];

export function Skills() {
  return (
    <section
      id="skills"
      className="relative border-t border-border bg-background pt-16 pb-10 sm:pt-20 sm:pb-14 md:pt-24"
    >
      <div className="container-edge">
        <Reveal>
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:pb-6">
            <p className="eyebrow">[ Sec. 07 ] Skills</p>
            <p className="hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:block">
              Languages · Frameworks · Tools
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, ci) => (
            <Reveal key={cat.title} delay={ci * 0.06}>
              <div className="flex h-full flex-col rounded-none border border-border bg-surface/40 p-5">
                <p className="eyebrow mb-1">{cat.eyebrow}</p>
                <p className="font-display text-base font-medium tracking-tight text-foreground mb-4">
                  {cat.title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {cat.skills.map((skill) => (
                    <li key={skill.name} className="flex items-center gap-2.5">
                      <span className="size-5 shrink-0 flex items-center justify-center">
                        {Logo[skill.logo]}
                      </span>
                      <span className="text-[13px] text-foreground/80">
                        {skill.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
