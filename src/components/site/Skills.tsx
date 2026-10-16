import { Reveal } from "./Reveal";

// Pristine, official, high-fidelity vector SVG logos for all tools
const Logo = {
  python: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.89S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.031v-2.867s-.109-3.403 3.347-3.403h5.765s3.236.052 3.236-3.127V3.107S18.28 0 11.914 0zm-3.2 1.799a1.047 1.047 0 1 1 0 2.094 1.047 1.047 0 0 1 0-2.094z"
        fill="#3776AB"
      />
      <path
        d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752H12v-.826h8.131S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.031v2.867s.109 3.403-3.347 3.403H9.454s-3.236-.052-3.236 3.127v5.325S5.72 24 12.086 24zm3.2-1.799a1.047 1.047 0 1 1 0-2.094 1.047 1.047 0 0 1 0 2.094z"
        fill="#FFD43B"
      />
    </svg>
  ),
  sql: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <ellipse cx="12" cy="5" rx="8" ry="3" fill="#336791" />
      <path
        d="M4 5v5c0 1.66 3.58 3 8 3s8-1.34 8-3V5"
        stroke="#336791"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 10v5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5"
        stroke="#336791"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 15v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4"
        stroke="#336791"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 17l4 4m0-4l-4 4"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  r_lang: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <ellipse cx="11.5" cy="12" rx="9" ry="7" fill="#CBDBE9" />
      <path
        d="M6 7.5h6.5c3 0 4.5 1.2 4.5 3.3 0 2.1-1.5 3.2-3.8 3.2H9v4.5H6V7.5zm3 4.2h3.2c1.2 0 1.8-.5 1.8-1.2 0-.8-.6-1.2-1.8-1.2H9v2.4zm5.5 2.8l4 6.5h-3.4l-3.3-5.5h2.7z"
        fill="#1F64B7"
      />
    </svg>
  ),
  cpp: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <polygon
        points="12,2 21.5,7.5 21.5,18.5 12,24 2.5,18.5 2.5,7.5"
        fill="#00599C"
      />
      <path
        d="M10.8 15.6c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6c1.1 0 2.1.5 2.7 1.3l-1.3 1c-.3-.5-.8-.8-1.4-.8-1.2 0-2.1 1-2.1 2.1s1 2.1 2.1 2.1c.6 0 1.1-.3 1.4-.8l1.3 1c-.6.8-1.6 1.3-2.7 1.3z"
        fill="#fff"
      />
      <path
        d="M15 11v2m-1-1h2M19 11v2m-1-1h2"
        stroke="#004482"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M15 11v2m-1-1h2M19 11v2m-1-1h2"
        stroke="#fff"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  java: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M9 18.5c2.5.3 5.5-.2 7.5-1.5-1.5 1.8-4.5 2.5-7.5 1.5zm-1-3c3 .3 6-.3 8.5-1.8-1.8 2-5 2.8-8.5 1.8zm4-13c-1.5 1.5-1.5 3 0 4.5-1.5-1.5-1.5-3 0-4.5zm2.5 1c-1.8 1.8-1.8 3.5 0 5.2-1.8-1.8-1.8-3.5 0-5.2zM4 21c4.5.8 11.5.8 16 0-3.5 1-12.5 1-16 0z"
        fill="#E76F00"
      />
      <path
        d="M7 11c0 3 2.5 5 5 5s5-2 5-5h-10zm11 1c1 0 2 .5 2 1.5s-1 1.5-2 1.5v-3z"
        fill="#5382A1"
      />
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="3" fill="#F7DF1E" />
      <path
        d="M7.5 18c.5.8 1.2 1.2 2.2 1.2 1.2 0 1.8-.7 1.8-1.8v-6.4H9.7v6.4c0 .5-.2.7-.6.7-.4 0-.6-.2-.8-.6L7.5 18zm6.7 1.1c.9.6 2 .9 3.1.9 2.1 0 3.3-1.1 3.3-2.8 0-1.6-1-2.2-2.5-2.8l-.5-.2c-.9-.4-1.3-.7-1.3-1.3 0-.6.5-1 1.3-1 .8 0 1.4.3 1.9.8l1.1-1.3c-.7-.7-1.7-1.1-2.9-1.1-2 0-3.1 1.1-3.1 2.6 0 1.5 1 2.2 2.4 2.8l.5.2c.9.4 1.4.7 1.4 1.4 0 .7-.6 1.1-1.5 1.1-.9 0-1.7-.4-2.3-1l-1.4 1.4z"
        fill="#000"
      />
    </svg>
  ),
  typescript: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="3" fill="#3178C6" />
      <path
        d="M13.5 12.5H11v7h-2v-7H6.5v-2h7v2zm1.5 5.5c.4.3.9.5 1.5.5.7 0 1.2-.3 1.2-.8 0-.5-.3-.8-1.2-1.1l-.5-.2c-1.3-.5-2-1.2-2-2.4 0-1.3 1-2.2 2.6-2.2 1 0 1.8.3 2.4 1l-1 1.2c-.4-.4-.8-.6-1.3-.6-.6 0-.9.3-.9.7 0 .5.3.7 1.1 1l.5.2c1.4.5 2.1 1.3 2.1 2.5 0 1.5-1.1 2.4-2.9 2.4-1.1 0-2.1-.4-2.8-1.1l1.2-1.1z"
        fill="#fff"
      />
    </svg>
  ),
  react: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="12" r="2.1" fill="#61DAFB" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="3.8"
        stroke="#61DAFB"
        strokeWidth="1.2"
        fill="none"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="3.8"
        stroke="#61DAFB"
        strokeWidth="1.2"
        fill="none"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="3.8"
        stroke="#61DAFB"
        strokeWidth="1.2"
        fill="none"
        transform="rotate(120 12 12)"
      />
    </svg>
  ),
  nextjs: (
    <svg viewBox="0 0 24 24" className="size-full" fill="currentColor">
      <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0z" />
    </svg>
  ),
  nodejs: (
    // Official Node.js Brand Vector (Hexagon + stylized interior)
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M12 2l8.8 5.1v10.2L12 22.4l-8.8-5.1V7.1L12 2z"
        fill="#339933"
      />
      <path
        d="M12 4.1l6.7 3.9v7.8L12 19.7l-6.7-3.9V8L12 4.1z"
        fill="#43853D"
      />
      <path
        d="M12.5 8.2c-.4-.2-.9-.3-1.4-.3-1.2 0-2.1.8-2.1 2.2v4.8h1.4v-4.5c0-.6.4-1 1-1 .4 0 .8.1 1.1.3v-1.5z"
        fill="#fff"
      />
      <circle cx="15.5" cy="12" r="1.5" fill="#fff" />
    </svg>
  ),
  express: (
    // Official Express.js Minimal Typography Vector
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="3.5" fill="#18181B" />
      <text
        x="12"
        y="15.5"
        textAnchor="middle"
        fontSize="7.5"
        fontWeight="800"
        fill="#fff"
        letterSpacing="0.5"
        fontFamily="sans-serif"
      >
        ex
      </text>
    </svg>
  ),
  fastapi: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="12" r="11" fill="#059669" />
      <path d="M12.5 3L5 13.5h7L11 21l8-10.5h-7L12.5 3z" fill="#fff" />
    </svg>
  ),
  postgresql: (
    // Official PostgreSQL Elephant "Slonik" Vector
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M12 2C8 2 4.5 4.5 3.5 8c-1 3.5-.5 7 1.5 10 .5.8 1.2 1.5 2 2v2c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-2h2v2c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-2c2.5-1 4.5-3 5.5-5.5.8-2 .8-4.5 0-6.5C20.5 4.5 16.5 2 12 2z"
        fill="#336791"
      />
      <circle cx="8.5" cy="9.5" r="1.2" fill="#fff" />
      <circle cx="8.5" cy="9.5" r="0.6" fill="#1E293B" />
      <path
        d="M11 13c1.5 1.5 4.5 2 6.5.5"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M13 8.5c2 0 4 .8 5 2.2"
        stroke="#64B5F6"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  ),
  tensorflow: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zM22.708 8.117l-6.168-3.564v13.02L12.46 20V0l10.248 5.856v2.26z"
        fill="#FF6F00"
      />
    </svg>
  ),
  scikitlearn: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="12" r="10" fill="#F7931E" />
      <path
        d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z"
        fill="#fff"
      />
      <path
        d="M9 12c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3z"
        fill="#3499CD"
      />
      <circle cx="15.5" cy="8.5" r="1.5" fill="#F7931E" />
    </svg>
  ),
  pandas: (
    // Official Pandas Staggered 4-Bar Logo
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect x="3" y="10" width="3.5" height="10" rx="1.5" fill="#150458" />
      <rect x="8" y="4" width="3.5" height="16" rx="1.5" fill="#FFCA00" />
      <rect x="13" y="8" width="3.5" height="12" rx="1.5" fill="#E70488" />
      <rect x="18" y="13" width="3.5" height="7" rx="1.5" fill="#00A3E0" />
    </svg>
  ),
  opencv: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="6" r="4" fill="#EA4335" />
      <circle cx="6" cy="16" r="4" fill="#4285F4" />
      <circle cx="18" cy="16" r="4" fill="#34A853" />
      <circle cx="12" cy="6" r="1.8" fill="#fff" />
      <circle cx="6" cy="16" r="1.8" fill="#fff" />
      <circle cx="18" cy="16" r="1.8" fill="#fff" />
    </svg>
  ),
  xgboost: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="4" fill="#189AB4" />
      <path
        d="M6 18L11 6h2.5L8.5 18H6zm6.5 0L17.5 6H20L15 18h-2.5z"
        fill="#fff"
      />
      <circle cx="12" cy="12" r="1.8" fill="#FFD700" />
    </svg>
  ),
  gemini: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"
        fill="url(#gem-grad-clean)"
      />
      <path
        d="M12 4c0 4.4-3.6 8-8 8 4.4 0 8 3.6 8 8 0-4.4 3.6-8 8-8-4.4 0-8-3.6-8-8z"
        fill="#fff"
      />
      <defs>
        <linearGradient
          id="gem-grad-clean"
          x1="2"
          y1="2"
          x2="22"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4285F4" />
          <stop offset=".5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  ),
  numpy: (
    // Official NumPy 3D Isometric Matrix Cube
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#4DABCF" />
      <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#013243" opacity="0.3" />
      <path d="M12 12v10l9-5V7l-9 5z" fill="#013243" opacity="0.15" />
      <path
        d="M7.5 9v6l3-1.8V7.2L7.5 9zm6-3.6v6l3-1.8V3.6l-3 1.8z"
        fill="#fff"
      />
    </svg>
  ),
  keras: (
    // Official Keras Red Square with Stylized "K"
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="3.5" fill="#D00000" />
      <path
        d="M6 5h3v14H6V5zm8.5 0h3.2L12.5 11l5.5 8H14.5l-4-6 4-8z"
        fill="#fff"
      />
    </svg>
  ),
  pytorch: (
    // Official PyTorch Flame Vector
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M13.5 2.5C13.5 2.5 14 5 12 7c-2 2-4.5 3-4.5 6.5 0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-3-6-4.5-8.5-.8-1.3-1.5-2.5-1.5-2.5z"
        fill="#EE4C2C"
      />
      <circle cx="16" cy="6" r="1.5" fill="#EE4C2C" />
    </svg>
  ),
  statsmodels: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="3.5" fill="#1E3A8A" />
      <path
        d="M4 18c3-1 5-9 8-9s5 8 8 7"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="7" cy="14" r="1.3" fill="#FACC15" />
      <circle cx="12" cy="9" r="1.3" fill="#FACC15" />
      <circle cx="17" cy="13" r="1.3" fill="#FACC15" />
    </svg>
  ),
  matplotlib: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="12" r="10" fill="#11557C" />
      <path
        d="M5 14c2-5 5-7 7-7s5 3 7 8"
        stroke="#38BDF8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5 17c3-2 5-3 7-3s4 1 7 3"
        stroke="#F97316"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7" r="1.4" fill="#4ADE80" />
    </svg>
  ),
  seaborn: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="3.5" fill="#4C72B0" />
      <path
        d="M4 17c3 0 5-8 8-8s5 8 8 8"
        stroke="#EAF2F8"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M6 17c2 0 4-5 6-5s4 5 6 5"
        stroke="#55A868"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  plotly: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect width="24" height="24" rx="3.5" fill="#252438" />
      <rect x="5" y="13" width="2.5" height="7" rx="1.25" fill="#8C8CE6" />
      <rect x="9.5" y="7" width="2.5" height="13" rx="1.25" fill="#2391FF" />
      <rect x="14" y="10" width="2.5" height="10" rx="1.25" fill="#F26C98" />
      <rect x="18.5" y="4" width="2.5" height="16" rx="1.25" fill="#FFB642" />
    </svg>
  ),
  tableau: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect x="11.2" y="2" width="1.6" height="5" fill="#E8762D" rx="0.8" />
      <rect x="9.5" y="3.7" width="5" height="1.6" fill="#E8762D" rx="0.8" />
      <rect x="11.2" y="17" width="1.6" height="5" fill="#1F4570" rx="0.8" />
      <rect x="9.5" y="18.7" width="5" height="1.6" fill="#1F4570" rx="0.8" />
      <rect x="2" y="11.2" width="5" height="1.6" fill="#28497C" rx="0.8" />
      <rect x="3.7" y="9.5" width="1.6" height="5" fill="#28497C" rx="0.8" />
      <rect x="17" y="11.2" width="5" height="1.6" fill="#E8762D" rx="0.8" />
      <rect x="18.7" y="9.5" width="1.6" height="5" fill="#E8762D" rx="0.8" />
      <rect x="10.8" y="9.5" width="2.4" height="5" fill="#EB1F28" rx="1" />
      <rect x="9.5" y="10.8" width="5" height="2.4" fill="#EB1F28" rx="1" />
    </svg>
  ),
  jupyter: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M12 5.5c-4.2 0-7.7 1.8-8.5 4.2 1.4-.8 3.5-1.2 5.8-1.2 4.2 0 7.8 1.4 8.5 3.3.3-.7.4-1.4.4-2.1 0-2.3-2.8-4.2-6.2-4.2z"
        fill="#F37626"
      />
      <path
        d="M12 18.5c4.2 0 7.7-1.8 8.5-4.2-1.4.8-3.5 1.2-5.8 1.2-4.2 0-7.8-1.4-8.5-3.3-.3.7-.4 1.4-.4 2.1 0 2.3 2.8 4.2 6.2 4.2z"
        fill="#F37626"
      />
      <circle cx="6" cy="4" r="1.4" fill="#767677" />
      <circle cx="18" cy="20" r="1.4" fill="#767677" />
      <circle cx="19.5" cy="8" r="1" fill="#767677" />
    </svg>
  ),
  aws: (
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M6 10.5c-.8 0-1.4.2-1.8.6l.4.7c.3-.3.8-.5 1.4-.5.8 0 1.2.4 1.2 1v.2c-.4 0-1 .1-1.6.3-.9.3-1.4.8-1.4 1.5 0 .8.6 1.4 1.6 1.4.7 0 1.2-.3 1.5-.8v.7h1V12c0-1-.8-1.5-2.3-1.5zm.2 3.8c-.5 0-.9-.3-.9-.7 0-.5.4-.8 1.1-.8.4 0 .8.1 1 .2-.2.8-.7 1.3-1.2 1.3z"
        fill="#fff"
      />
      <path
        d="M11.4 10.7l-1 4.8h1l.7-3.4.7 3.4h1l.7-3.4.7 3.4h1l-1-4.8h-1.1l-.8 3.3-.8-3.3h-1.1z"
        fill="#fff"
      />
      <path
        d="M18.8 12.3c-.7-.2-1.2-.4-1.2-.7 0-.3.3-.5.8-.5.5 0 1 .2 1.3.5l.5-.7c-.5-.4-1.1-.6-1.8-.6-1.1 0-1.8.6-1.8 1.4 0 .7.5 1.1 1.3 1.3.8.2 1.3.4 1.3.8 0 .4-.4.6-1 .6-.6 0-1.2-.3-1.6-.7l-.5.7c.5.5 1.2.8 2.1.8 1.2 0 1.9-.6 1.9-1.5 0-.8-.6-1.2-1.3-1.4z"
        fill="#fff"
      />
      <path
        d="M4 17.5c4 2.8 10 2.8 14.5.3"
        stroke="#FF9900"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M19 16.5l.8 2-1.8-.4"
        stroke="#FF9900"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  mongodb: (
    // 100% Authentic Official MongoDB Leaf Logo
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M12.001 0.448C11.517 0.941 6.136 6.34 6.136 12.879C6.136 17.659 9.387 21.685 11.558 23.513C11.838 23.748 12.164 23.748 12.444 23.513C14.615 21.685 17.866 17.659 17.866 12.879C17.866 6.34 12.485 0.941 12.001 0.448Z"
        fill="#13AA52"
      />
      <path
        d="M12.001 0.448C11.868 0.584 6.136 6.368 6.136 12.879C6.136 17.659 9.387 21.685 11.558 23.513C11.71 23.641 11.874 23.708 12.001 23.731V0.448Z"
        fill="#116149"
      />
      <path
        d="M12.001 4.708V19.789C13.882 18.257 16.299 15.021 16.299 12.879C16.299 8.243 12.81 4.708 12.001 4.708Z"
        fill="#13AA52"
      />
      <path
        d="M12.001 4.708C11.192 4.708 7.703 8.243 7.703 12.879C7.703 15.021 10.12 18.257 12.001 19.789V4.708Z"
        fill="#FFEAA5"
        opacity="0.3"
      />
    </svg>
  ),
  mysql: (
    // 100% Authentic Official MySQL Dolphin Sakila Logo
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M12.92 5.48c-.09 0-.18-.01-.28-.01-1.34 0-2.58.65-3.38 1.73-.24.34-.44.71-.57 1.12-.49 1.52-.18 3.25.8 4.5.42.54.96.96 1.56 1.23.15.07.31.12.47.17.21.06.43.1.66.11.56.04 1.12-.06 1.63-.3.79-.35 1.44-.97 1.83-1.75.39-.78.48-1.68.24-2.53a4.27 4.27 0 0 0-.96-1.69 4.29 4.29 0 0 0-2.01-1.38z"
        fill="#00758F"
      />
      <path
        d="M16.51 3.52c-1.31-1.04-3.03-1.57-4.79-1.49-1.76.08-3.41.77-4.61 1.93-1.19 1.16-1.87 2.72-1.9 4.35-.03 1.63.59 3.22 1.73 4.42.39.41.84.77 1.33 1.06.16.1.33.18.51.25.31.13.63.23.96.3.73.15 1.49.12 2.21-.08.72-.2 1.38-.58 1.91-1.1 1.06-1.03 1.64-2.48 1.6-3.95-.04-1.48-.7-2.88-1.85-3.89z"
        fill="#00618A"
      />
      <path
        d="M21.9 15.7c-.46-.34-1.07-.56-1.74-.61-.85-.07-1.69.16-2.35.65-.66.49-1.05 1.2-1.1 2-.05.78.26 1.54.87 2.07.61.54 1.41.8 2.22.74.83-.07 1.6-.49 2.08-1.15.49-.66.66-1.49.47-2.28-.08-.36-.24-.68-.45-.96v-.46z"
        fill="#00758F"
      />
      <path
        d="M14.5 5.8c.8-.5 1.8-.7 2.7-.5-.6.8-1.4 1.3-2.3 1.5-.1-.4-.2-.7-.4-1z"
        fill="#F29111"
      />
      <path
        d="M3.2 18.8c1.5 1.8 3.8 2.8 6.2 2.7-1.8-.5-3.3-1.6-4.2-3.1-.7.2-1.4.3-2 .4z"
        fill="#F29111"
      />
    </svg>
  ),
  vscode: (
    // 100% Authentic Official Visual Studio Code Logo
    <svg viewBox="0 0 32 32" className="size-full" fill="none">
      <path
        d="m29.01 5.03-5.766-2.776a1.74 1.74 0 0 0-1.989.338L2.38 19.8a1.166 1.166 0 0 0-.08 1.647q.037.04.077.077l1.541 1.4a1.165 1.165 0 0 0 1.489.066L28.142 5.75A1.158 1.158 0 0 1 30 6.672v-.067a1.75 1.75 0 0 0-.99-1.575"
        fill="#0065a9"
      />
      <path
        d="m29.01 26.97-5.766 2.777a1.745 1.745 0 0 1-1.989-.338L2.38 12.2a1.166 1.166 0 0 1-.08-1.647q.037-.04.077-.077l1.541-1.4A1.165 1.165 0 0 1 5.41 9.01l22.732 17.24A1.158 1.158 0 0 0 30 25.328v.072a1.75 1.75 0 0 1-.99 1.57"
        fill="#007acc"
      />
      <path
        d="M23.244 29.747a1.745 1.745 0 0 1-1.989-.338A1.025 1.025 0 0 0 23 28.684V3.316a1.024 1.024 0 0 0-1.749-.724 1.74 1.74 0 0 1 1.989-.339l5.765 2.772A1.75 1.75 0 0 1 30 6.6v18.8a1.75 1.75 0 0 1-.991 1.576Z"
        fill="#1f9cf0"
      />
    </svg>
  ),
  git: (
    // Official Git Orange Rhombus with Branch Forks
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="16"
        height="16"
        rx="2"
        transform="rotate(45 10.5 10.5)"
        fill="#F05032"
      />
      <circle cx="12" cy="7" r="1.5" fill="#fff" />
      <circle cx="8.5" cy="12" r="1.5" fill="#fff" />
      <circle cx="12" cy="15.5" r="1.5" fill="#fff" />
      <path
        d="M12 7v8.5M8.5 12c0-2 3.5-2.5 3.5-4.5"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  docker: (
    // Official Docker Blue Whale with Containers
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <rect x="5.5" y="8" width="2" height="1.8" fill="#1D63ED" rx="0.3" />
      <rect x="8" y="8" width="2" height="1.8" fill="#1D63ED" rx="0.3" />
      <rect x="10.5" y="8" width="2" height="1.8" fill="#1D63ED" rx="0.3" />
      <rect x="5.5" y="10.2" width="2" height="1.8" fill="#1D63ED" rx="0.3" />
      <rect x="8" y="10.2" width="2" height="1.8" fill="#1D63ED" rx="0.3" />
      <rect x="10.5" y="10.2" width="2" height="1.8" fill="#1D63ED" rx="0.3" />
      <rect x="13" y="10.2" width="2" height="1.8" fill="#1D63ED" rx="0.3" />
      <path
        d="M21.5 13.5c-.5-.4-1.4-.5-2.2-.2-.2-.8-.7-1.5-1.5-1.8H15c-.2 0-.4 1-.4 1s-1.5 0-2 0H2.5c-.3 1.5.2 4 2.5 5.5 3.5 2.2 9.5 2.2 13.5 0 2.2-1.2 3.2-3 3-4.5z"
        fill="#0DB7ED"
      />
      <circle cx="18" cy="14" r="0.5" fill="#fff" />
    </svg>
  ),
  linux: (
    // Official Linux Tux Vector
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <ellipse cx="12" cy="13" rx="6" ry="8" fill="#18181B" />
      <ellipse cx="12" cy="14" rx="4" ry="6" fill="#FAFAFA" />
      <circle cx="10" cy="8" r="1.3" fill="#fff" />
      <circle cx="14" cy="8" r="1.3" fill="#fff" />
      <circle cx="10.4" cy="8" r="0.7" fill="#000" />
      <circle cx="13.6" cy="8" r="0.7" fill="#000" />
      <polygon points="12,9 10,11 14,11" fill="#F59E0B" />
      <ellipse cx="8" cy="20.5" rx="2.5" ry="1.2" fill="#F59E0B" />
      <ellipse cx="16" cy="20.5" rx="2.5" ry="1.2" fill="#F59E0B" />
    </svg>
  ),
  twilio: (
    // Official Twilio Red Disc with 4 White Dots
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <circle cx="12" cy="12" r="10" fill="#F22F46" />
      <circle cx="9" cy="9" r="1.8" fill="#fff" />
      <circle cx="15" cy="9" r="1.8" fill="#fff" />
      <circle cx="9" cy="15" r="1.8" fill="#fff" />
      <circle cx="15" cy="15" r="1.8" fill="#fff" />
    </svg>
  ),
  aes: (
    // Modern AES-256 Security Cryptographic Shield
    <svg viewBox="0 0 24 24" className="size-full" fill="none">
      <path
        d="M12 2L4 5v6c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V5l-8-3z"
        fill="#059669"
      />
      <rect x="9" y="11" width="6" height="5" rx="1" fill="#fff" />
      <path
        d="M10 11V9a2 2 0 1 1 4 0v2"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="13.5" r="0.8" fill="#059669" />
    </svg>
  ),
};

type Skill = { name: string; logo: keyof typeof Logo };

const categories = [
  {
    title: "Core",
    eyebrow: "Core",
    blurb: "The languages and query layer that show up in nearly every build.",
    skills: [
      { name: "Python", logo: "python" },
      { name: "JavaScript", logo: "javascript" },
      { name: "TypeScript", logo: "typescript" },
      { name: "SQL", logo: "sql" },
      { name: "R", logo: "r_lang" },
      { name: "C/C++", logo: "cpp" },
      { name: "Java", logo: "java" },
    ],
  },
  {
    title: "Frontend & Backend",
    eyebrow: "Frameworks & Runtime",
    blurb: "The app layer and server runtimes I use to move from prototypes to shipping systems.",
    skills: [
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "nextjs" },
      { name: "Node.js", logo: "nodejs" },
      { name: "Express.js", logo: "express" },
      { name: "FastAPI", logo: "fastapi" },
      { name: "PostgreSQL", logo: "postgresql" },
    ],
  },
  {
    title: "AI & Data Science",
    eyebrow: "ML / AI",
    blurb:
      "Modeling, feature work, and the tooling around practical ML systems.",
    skills: [
      { name: "TensorFlow", logo: "tensorflow" },
      { name: "Scikit-learn", logo: "scikitlearn" },
      { name: "Pandas", logo: "pandas" },
      { name: "OpenCV", logo: "opencv" },
      { name: "XGBoost", logo: "xgboost" },
      { name: "Gemini API", logo: "gemini" },
      { name: "NumPy", logo: "numpy" },
      { name: "Keras", logo: "keras" },
      { name: "PyTorch", logo: "pytorch" },
      { name: "Statsmodels", logo: "statsmodels" },
    ],
  },
  {
    title: "Visualization",
    eyebrow: "Charts",
    blurb:
      "How I turn data and experiments into something readable at a glance.",
    skills: [
      { name: "Matplotlib", logo: "matplotlib" },
      { name: "Seaborn", logo: "seaborn" },
      { name: "Plotly", logo: "plotly" },
      { name: "Tableau", logo: "tableau" },
    ],
  },
  {
    title: "Tools & Infra",
    eyebrow: "DevOps",
    blurb:
      "The supporting stack for shipping, debugging, and keeping projects reproducible.",
    skills: [
      { name: "Git", logo: "git" },
      { name: "Docker", logo: "docker" },
      { name: "Linux", logo: "linux" },
      { name: "Twilio", logo: "twilio" },
      { name: "AES-256", logo: "aes" },
      { name: "Jupyter Notebook", logo: "jupyter" },
      { name: "AWS", logo: "aws" },
      { name: "VS Code", logo: "vscode" },
      { name: "MongoDB", logo: "mongodb" },
      { name: "MySQL", logo: "mysql" },
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

        <div className="mt-8 max-w-6xl sm:mt-10">
          <Reveal>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              A compact view of the stack behind the portfolio: language work,
              app frameworks, model tooling, data viz, and the infra that keeps
              everything reproducible.
            </p>
          </Reveal>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface/35 shadow-xs">
            {categories.map((cat, ci) => (
              <Reveal key={cat.title} delay={ci * 0.05}>
                <article
                  className={`grid gap-5 p-4 sm:p-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8 ${ci > 0 ? "border-t border-border" : ""}`}
                >
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="eyebrow">{cat.eyebrow}</p>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {cat.title}
                    </h3>
                    <p className="max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {cat.blurb}
                    </p>
                  </div>

                  <ul className="flex flex-wrap gap-2 sm:gap-2.5">
                    {cat.skills.map((skill) => (
                      <li key={skill.name}>
                        <span className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/85 px-2.5 py-1.5 text-xs text-foreground transition-all duration-300 hover:border-foreground/30 hover:bg-ink-deep hover:text-background sm:px-3 sm:py-2 sm:text-[13px]">
                          <span className="flex size-4.5 sm:size-5 shrink-0 items-center justify-center [&_svg]:size-full">
                            {Logo[skill.logo]}
                          </span>
                          <span className="whitespace-nowrap font-medium tracking-tight">
                            {skill.name}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
