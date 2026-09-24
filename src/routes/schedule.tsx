import { PageHeaderHero } from "@/components/site/PageHeaderHero";
import { Reveal } from "@/components/site/Reveal";
import { Calendar } from "@/components/ui/calendar";
import { createFileRoute } from "@tanstack/react-router";
import { addDays, differenceInCalendarDays, format, isSameDay } from "date-fns";
import {
    AlertCircle,
    Briefcase,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    Code,
    Coffee,
    Copy,
    Download,
    ExternalLink,
    Globe,
    Laptop,
    Mail,
    RefreshCw,
    Send,
    Sparkles,
    User,
    Zap
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const calcomUsername =
  import.meta.env.VITE_CALCOM_USERNAME ?? "divyanshu-sharmax9";
const calcomBookingUrl = `https://cal.com/${calcomUsername}`;

const meetingTypes = [
  {
    id: "quick",
    duration: 15,
    title: "Quick Sync",
    badge: "15 MINS",
    description: "Introductory chat, rapid technical query, or virtual coffee.",
    icon: Coffee,
    defaultSection: "Collaboration" as const,
    defaultTopic: "Quick sync & introduction",
    color: "from-amber-500/20 to-orange-500/10 text-amber-500 border-amber-500/30",
  },
  {
    id: "discovery",
    duration: 30,
    title: "Project Discovery",
    badge: "30 MINS",
    description: "Scoping new web apps, AI systems, fullstack MVPs, or consulting.",
    icon: Laptop,
    defaultSection: "Project inquiry" as const,
    defaultTopic: "Project discovery & roadmap",
    color: "from-blue-500/20 to-cyan-500/10 text-blue-500 border-blue-500/30",
  },
  {
    id: "tech",
    duration: 45,
    title: "Deep Architecture",
    badge: "45 MINS",
    description: "Deep dive into model architectures, agentic loops, code & performance.",
    icon: Code,
    defaultSection: "Collaboration" as const,
    defaultTopic: "AI architecture & technical deep-dive",
    color: "from-violet-500/20 to-purple-500/10 text-violet-500 border-violet-500/30",
  },
  {
    id: "career",
    duration: 30,
    title: "Hiring & Mentorship",
    badge: "30 MINS",
    description: "Discuss full-time engineering roles, team leadership, or mentorship.",
    icon: Briefcase,
    defaultSection: "Hiring" as const,
    defaultTopic: "Engineering role discussion",
    color: "from-emerald-500/20 to-teal-500/10 text-emerald-500 border-emerald-500/30",
  },
] as const;

const timeSlots = [
  { time: "09:30", period: "morning", label: "09:30 AM" },
  { time: "11:00", period: "morning", label: "11:00 AM" },
  { time: "12:30", period: "afternoon", label: "12:30 PM" },
  { time: "14:00", period: "afternoon", label: "02:00 PM" },
  { time: "15:30", period: "afternoon", label: "03:30 PM" },
  { time: "17:00", period: "evening", label: "05:00 PM" },
  { time: "18:30", period: "evening", label: "06:30 PM" },
  { time: "20:00", period: "evening", label: "08:00 PM" },
];

const timezones = [
  { id: "IST", label: "Asia/Kolkata (IST)", offsetMinutes: 330, flag: "🇮🇳" },
  { id: "EST", label: "America/New_York (EST)", offsetMinutes: -240, flag: "🇺🇸" },
  { id: "PST", label: "America/Los_Angeles (PST)", offsetMinutes: -420, flag: "🇺🇸" },
  { id: "GMT", label: "Europe/London (GMT/BST)", offsetMinutes: 60, flag: "🇬🇧" },
  { id: "CET", label: "Europe/Berlin (CET)", offsetMinutes: 120, flag: "🇪🇺" },
  { id: "SGT", label: "Asia/Singapore (SGT)", offsetMinutes: 480, flag: "🇸🇬" },
  { id: "JST", label: "Asia/Tokyo (JST)", offsetMinutes: 540, flag: "🇯🇵" },
];

const sectionOptions = [
  "Project inquiry",
  "Collaboration",
  "Speaking",
  "Hiring",
  "Other",
] as const;

const quickTopicChips = [
  {
    label: "⚡ AI & LLM Systems",
    section: "Project inquiry" as const,
    topic: "AI Agent & LLM Infrastructure",
    subject: "Inquiry: AI & LLM Systems Architecture",
    body: "Hi Divyanshu,\n\nI'd like to discuss building an AI-powered system / LLM workflow and explore your technical availability and approach.",
  },
  {
    label: "🌐 Full-Stack Web App",
    section: "Project inquiry" as const,
    topic: "Full-Stack Web Development",
    subject: "Inquiry: Web Application Engineering",
    body: "Hi Divyanshu,\n\nWe have a web application project and would love to review architecture, timeline, and how you could lead or contribute to implementation.",
  },
  {
    label: "🚀 Freelance / Contract",
    section: "Project inquiry" as const,
    topic: "Contract Engineering Engagement",
    subject: "Project Collaboration / Contract Role",
    body: "Hi Divyanshu,\n\nWe are looking for an experienced software engineer for a project engagement. Let's sync on scope, deliverables, and timeline.",
  },
  {
    label: "💼 Hiring / Team Role",
    section: "Hiring" as const,
    topic: "Full-Time Software Engineer Opportunity",
    subject: "Opportunity: Engineering Role at our team",
    body: "Hi Divyanshu,\n\nI came across your portfolio and would love to discuss a software engineering opportunity with our team.",
  },
  {
    label: "🤝 Open Source Collab",
    section: "Collaboration" as const,
    topic: "Open Source / Tech Partnership",
    subject: "Open Source Collaboration",
    body: "Hi Divyanshu,\n\nI saw your work and would love to brainstorm collaborating on open-source initiatives or hackathon projects.",
  },
];

type BookingState = "idle" | "sending" | "sent" | "error";

function isValidEmail(value: string) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value);
}

function formatSlotInTimezone(istTimeStr: string, tzId: string) {
  const [h, m] = istTimeStr.split(":").map(Number);
  const istMinutes = 330;
  const targetTz = timezones.find((t) => t.id === tzId) || timezones[0];
  const diffMinutes = targetTz.offsetMinutes - istMinutes;
  let totalMinutes = h * 60 + m + diffMinutes;
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
  const convH = Math.floor(totalMinutes / 60);
  const convM = totalMinutes % 60;
  const period = convH >= 12 ? "PM" : "AM";
  const displayH = convH % 12 === 0 ? 12 : convH % 12;
  return `${String(displayH).padStart(2, "0")}:${String(convM).padStart(2, "0")} ${period}`;
}

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule a Session - Divyanshu Sharma" },
      {
        name: "description",
        content:
          "Book an interactive 1-on-1 session, project discovery, or technical collaboration with Divyanshu Sharma.",
      },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const [viewMode, setViewMode] = useState<"interactive" | "calcom">("interactive");
  const [selectedType, setSelectedType] = useState<(typeof meetingTypes)[number]>(
    meetingTypes[1],
  );
  const [date, setDate] = useState<Date | undefined>(() => addDays(new Date(), 1));
  const [time, setTime] = useState("14:00");
  const [timezone, setTimezone] = useState("IST");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [section, setSection] =
    useState<(typeof sectionOptions)[number]>("Project inquiry");
  const [topic, setTopic] = useState("Project discovery & roadmap");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [bookingState, setBookingState] = useState<BookingState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [calEmbedKey, setCalEmbedKey] = useState(0);

  const selectedDate = useMemo(() => date ?? addDays(new Date(), 1), [date]);

  const activeTz = useMemo(
    () => timezones.find((t) => t.id === timezone) || timezones[0],
    [timezone],
  );

  const convertedTimeLabel = useMemo(
    () => formatSlotInTimezone(time, timezone),
    [time, timezone],
  );

  const ticketRefId = useMemo(() => {
    return `DX9-${format(selectedDate, "MMdd")}-${time.replace(":", "")}`;
  }, [selectedDate, time]);

  const relativeDayLabel = useMemo(() => {
    const today = new Date();
    if (isSameDay(selectedDate, today)) return "Today";
    if (isSameDay(selectedDate, addDays(today, 1))) return "Tomorrow";
    const diff = differenceInCalendarDays(selectedDate, today);
    return diff > 0 ? `In ${diff} days` : format(selectedDate, "MMM d");
  }, [selectedDate]);

  function handleSelectType(type: (typeof meetingTypes)[number]) {
    setSelectedType(type);
    setSection(type.defaultSection);
    setTopic(type.defaultTopic);
    if (!subject) {
      setSubject(`${type.title} - ${format(selectedDate, "MMMM d")}`);
    }
  }

  function applyQuickChip(chip: (typeof quickTopicChips)[number]) {
    setSection(chip.section);
    setTopic(chip.topic);
    setSubject(chip.subject);
    setBody(chip.body);
    toast.success(`Applied template: "${chip.label}"`);
  }

  function handleCopyInviteDetails() {
    const attendee = name.trim() ? `${name.trim()} (${email.trim() || "Email not specified"})` : "Guest Attendee";
    const text = [
      `📅 Meeting with Divyanshu Sharma`,
      `Format: ${selectedType.title} (${selectedType.badge})`,
      `Date: ${format(selectedDate, "EEEE, MMMM d, yyyy")} (${relativeDayLabel})`,
      `Time: ${convertedTimeLabel} (${activeTz.label}) / ${time} IST`,
      `Attendee: ${attendee}`,
      `Topic: ${topic || selectedType.defaultTopic}`,
      `Subject: ${subject || selectedType.title}`,
      `Live Cal.com Link: ${calcomBookingUrl}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    toast.success("Meeting details copied to clipboard!");
  }

  function handleDownloadIcs() {
    const [h, m] = time.split(":").map(Number);
    const start = new Date(selectedDate);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + selectedType.duration * 60 * 1000);

    // Convert IST to UTC (subtract 5h 30m)
    const startUtc = new Date(start.getTime() - 5.5 * 60 * 60 * 1000);
    const endUtc = new Date(end.getTime() - 5.5 * 60 * 60 * 1000);

    const formatUtc = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    const icsSummary = `${selectedType.title} - Divyanshu Sharma & ${name.trim() || "Guest"}`;
    const icsDescription = `${topic}\n\nNotes: ${body || "1-on-1 session"}\n\nCal.com: ${calcomBookingUrl}`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Divyanshu Sharma//Meeting Scheduler//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:${ticketRefId}@divyanshux9.dev`,
      `DTSTAMP:${formatUtc(new Date())}`,
      `DTSTART:${formatUtc(startUtc)}`,
      `DTEND:${formatUtc(endUtc)}`,
      `SUMMARY:${icsSummary}`,
      `DESCRIPTION:${icsDescription.replace(/\n/g, "\\n")}`,
      "LOCATION:Video Call (Cal.com / Google Meet)",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `meeting-divyanshu-${format(selectedDate, "yyyyMMdd")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Calendar invite (.ics) downloaded!");
  }

  function handleGoogleCalendar() {
    const [h, m] = time.split(":").map(Number);
    const start = new Date(selectedDate);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + selectedType.duration * 60 * 1000);

    const startUtc = new Date(start.getTime() - 5.5 * 60 * 60 * 1000);
    const endUtc = new Date(end.getTime() - 5.5 * 60 * 60 * 1000);

    const formatUtc = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    const datesParam = `${formatUtc(startUtc)}/${formatUtc(endUtc)}`;

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `${selectedType.title} with Divyanshu Sharma`,
      details: `${topic}\n\n${body || "Looking forward to our session!"}\n\nHost: Divyanshu Sharma\nCal: ${calcomBookingUrl}`,
      dates: datesParam,
      location: "Google Meet / Cal.com Video Call",
    });

    window.open(
      `https://calendar.google.com/calendar/render?${params.toString()}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function handleBookingSubmit() {
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (email.trim() && !isValidEmail(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!body.trim()) {
      toast.error("Please add a short note or agenda for our meeting.");
      return;
    }

    setBookingState("sending");
    setErrorMessage("");

    const payload = {
      name: name.trim(),
      email: email.trim() || null,
      date: format(selectedDate, "yyyy-MM-dd"),
      time,
      section,
      topic: topic.trim() || selectedType.title,
      subject:
        subject.trim() ||
        `${selectedType.title} (${selectedType.badge}) on ${format(selectedDate, "MMMM d")}`,
      body: body.trim(),
      time_zone: activeTz.label,
      meeting_url: calcomBookingUrl,
    };

    try {
      const response = await fetch("/api/booking/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (response.ok) {
        setBookingState("sent");
        toast.success("Meeting request sent! Divyanshu will confirm promptly.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setBookingState("error");
        setErrorMessage(
          errorData.detail ||
            "Unable to deliver automated mail right now. You can still lock the slot via Cal.com!",
        );
        toast.error("Notice: Could not send automated mail. Cal.com backup is ready!");
      }
    } catch {
      setBookingState("error");
      setErrorMessage(
        "Network connection issue. You can lock your slot directly through Cal.com below!",
      );
      toast.error("Network issue: Please use the direct Cal.com option.");
    }
  }

  const emailLooksValid = email.trim() === "" || isValidEmail(email.trim());
  const canSubmit = Boolean(name.trim()) && emailLooksValid && Boolean(body.trim());

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-7xl pb-24">
        {/* Header Hero Banner */}
        <PageHeaderHero
          sectionIndex="01"
          eyebrow="Interactive Scheduler"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Schedule" },
          ]}
          title="Book a 1-on-1 session or technical sync."
          description="Select your preferred meeting format, pick an interactive date & time slot across timezones, or connect directly through Cal.com."
          stats={[
            {
              label: "Selected Duration",
              value: selectedType.badge,
              badgeType: "session",
            },
            {
              label: "Primary Timezone",
              value: activeTz.id,
              badgeType: "timezone",
            },
            {
              label: "Sync Engine",
              value: "Live Cal.com",
              badgeType: "stack",
            },
            {
              label: "Avg Confirmation",
              value: "< 24 Hours",
              badgeType: "response",
            },
          ]}
        />

        {/* View Mode Switcher Pills */}
        <section className="border-t border-border bg-background pt-8 pb-4">
          <div className="container-edge">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1 rounded-full border border-border bg-surface/40 p-1 shadow-2xs max-w-full overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setViewMode("interactive")}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    viewMode === "interactive"
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className="size-3.5 shrink-0" />
                  <span className="whitespace-nowrap">
                    <span className="hidden sm:inline">Interactive </span>Planner & Pass
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("calcom")}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-2 text-xs font-semibold tracking-wide transition-all ${
                    viewMode === "calcom"
                      ? "bg-foreground text-background shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CalendarIcon className="size-3.5 shrink-0" />
                  <span className="whitespace-nowrap">
                    <span className="hidden sm:inline">Direct </span>Cal.com Studio
                  </span>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </button>
              </div>

              {/* External Link Out */}
              <a
                href={calcomBookingUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>cal.com/{calcomUsername}</span>
                <ExternalLink className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-6">
          <div className="container-edge">
            {viewMode === "calcom" ? (
              /* Cal.com Embedded View */
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background font-mono text-sm font-bold">
                      CAL
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Live Cal.com Booking Studio
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Connected directly with Divyanshu's live Google / Apple calendar sync.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCalEmbedKey((k) => k + 1)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface"
                    >
                      <RefreshCw className="size-3.5" />
                      <span>Reload</span>
                    </button>
                    <a
                      href={calcomBookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90"
                    >
                      <span>Open Fullscreen</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>

                <div className="relative min-h-[680px] w-full overflow-hidden rounded-3xl border border-border bg-surface/20 shadow-xl">
                  <iframe
                    key={calEmbedKey}
                    src={calcomBookingUrl}
                    title="Cal.com Booking"
                    className="h-[750px] w-full border-none"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              /* Interactive Booking View */
              <div className="grid gap-10 lg:grid-cols-12">
                {/* Left/Main Form & Selection (7 cols) */}
                <div className="space-y-8 lg:col-span-7">
                  {/* Step 1: Format Selector */}
                  <Reveal>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="eyebrow flex items-center gap-1.5">
                          <span>[ 01 ]</span> Choose Session Format
                        </p>
                        <span className="text-xs font-mono text-muted-foreground">
                          {selectedType.badge}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {meetingTypes.map((type) => {
                          const IconComponent = type.icon;
                          const isSelected = selectedType.id === type.id;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => handleSelectType(type)}
                              className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-300 ${
                                isSelected
                                  ? "border-foreground bg-surface shadow-md ring-1 ring-foreground/20"
                                  : "border-border bg-surface/30 hover:border-foreground/30 hover:bg-surface/60"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div
                                  className={`flex size-9 items-center justify-center rounded-xl border border-border bg-background/80 shadow-2xs transition-transform group-hover:scale-105`}
                                >
                                  <IconComponent className="size-4.5 text-foreground" />
                                </div>
                                <span className="rounded-full border border-border bg-background/80 px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-foreground">
                                  {type.badge}
                                </span>
                              </div>

                              <div className="mt-3">
                                <h3 className="font-display text-sm font-semibold tracking-tight text-foreground">
                                  {type.title}
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                  {type.description}
                                </p>
                              </div>

                              {isSelected && (
                                <motion.div
                                  layoutId="typeActiveIndicator"
                                  className="absolute top-2 right-2 flex size-2"
                                >
                                  <span className="size-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
                                  <span className="size-2 rounded-full bg-emerald-500" />
                                </motion.div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </Reveal>

                  {/* Step 2: Date & Slot Engine */}
                  <Reveal delay={0.05}>
                    <div className="space-y-4 rounded-3xl border border-border bg-surface/20 p-5 md:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
                        <div>
                          <p className="eyebrow flex items-center gap-1.5">
                            <span>[ 02 ]</span> Pick Date & Preferred Time
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {format(selectedDate, "EEEE, MMMM d, yyyy")} · {convertedTimeLabel}
                          </p>
                        </div>

                        {/* Timezone Selector */}
                        <div className="flex items-center gap-2">
                          <Globe className="size-3.5 text-muted-foreground" />
                          <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            aria-label="Select meeting timezone"
                            className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none transition-colors focus:border-foreground"
                          >
                            {timezones.map((tz) => (
                              <option key={tz.id} value={tz.id}>
                                {tz.flag} {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Quick Date Presets */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Quick days:
                        </span>
                        {[
                          { label: "Today", date: new Date() },
                          { label: "Tomorrow", date: addDays(new Date(), 1) },
                          { label: "In 2 Days", date: addDays(new Date(), 2) },
                          { label: "In 3 Days", date: addDays(new Date(), 3) },
                        ].map((preset) => {
                          const isMatch = isSameDay(selectedDate, preset.date);
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setDate(preset.date)}
                              className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                                isMatch
                                  ? "border-foreground bg-foreground text-background shadow-2xs"
                                  : "border-border bg-background/80 text-foreground hover:bg-surface"
                              }`}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Calendar + Slot Selector layout */}
                      <div className="grid gap-6 pt-2 md:grid-cols-12">
                        {/* Interactive Calendar picker */}
                        <div className="flex flex-col items-center justify-center md:col-span-7">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => newDate && setDate(newDate)}
                            disabled={(d) =>
                              d < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            className="w-full rounded-2xl border border-border bg-background/70 p-3 shadow-xs"
                          />
                        </div>

                        {/* Slots */}
                        <div className="space-y-3 md:col-span-5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">
                              Available Slots ({activeTz.id})
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground">
                              Host: IST
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {timeSlots.map((slot) => {
                              const isSelected = time === slot.time;
                              const localDisplay = formatSlotInTimezone(
                                slot.time,
                                timezone,
                              );
                              return (
                                <button
                                  key={slot.time}
                                  type="button"
                                  onClick={() => setTime(slot.time)}
                                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                                    isSelected
                                      ? "border-foreground bg-foreground text-background shadow-xs font-semibold"
                                      : "border-border bg-background/80 text-foreground hover:border-foreground/30 hover:bg-surface"
                                  }`}
                                >
                                  <span className="font-mono text-xs font-medium">
                                    {localDisplay}
                                  </span>
                                  {timezone !== "IST" && (
                                    <span className="mt-0.5 text-[10px] opacity-70">
                                      {slot.time} IST
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          <div className="rounded-xl border border-border/80 bg-background/60 p-3 text-[11px] text-muted-foreground leading-relaxed">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                              <Clock className="size-3 text-emerald-500" />
                              <span>Live Calendar Sync</span>
                            </div>
                            <p className="mt-1">
                              Times sync automatically with Cal.com to prevent double bookings.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  {/* Step 3: Meeting Topic & Attendee Form */}
                  <Reveal delay={0.1}>
                    <div className="space-y-5 rounded-3xl border border-border bg-surface/20 p-5 md:p-6">
                      <div className="border-b border-border/80 pb-3">
                        <p className="eyebrow flex items-center gap-1.5">
                          <span>[ 03 ]</span> Attendee Information & Purpose
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Tell Divyanshu what you'd like to focus on so we hit the ground running.
                        </p>
                      </div>

                      {/* Quick fill chips */}
                      <div className="space-y-2">
                        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Quick topic suggestions:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {quickTopicChips.map((chip) => (
                            <button
                              key={chip.label}
                              type="button"
                              onClick={() => applyQuickChip(chip)}
                              className="rounded-lg border border-border bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-surface"
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Input fields */}
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Your Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Alex Chen"
                              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-foreground"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Your Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="alex@company.com"
                              className={`w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-foreground ${
                                !emailLooksValid ? "border-rose-500" : "border-border"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Category / Section
                          </label>
                          <select
                            value={section}
                            onChange={(e) =>
                              setSection(
                                e.target.value as (typeof sectionOptions)[number],
                              )
                            }
                            aria-label="Meeting category"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-foreground"
                          >
                            {sectionOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Specific Topic
                          </label>
                          <input
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="AI Agent Architecture"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-foreground"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Meeting Subject
                          </label>
                          <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Discuss LLM evaluation pipeline"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-foreground"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Message & Agenda *
                          </label>
                          <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={4}
                            placeholder="Briefly outline what you'd like to achieve, relevant links, repo URLs, or questions..."
                            className="w-full rounded-xl border border-border bg-background p-3 text-base sm:text-sm text-foreground outline-none transition-colors focus:border-foreground"
                          />
                        </div>
                      </div>

                      {/* Feedback & Submission Bar */}
                      <div className="pt-2">
                        {bookingState === "sent" ? (
                          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="size-6 text-emerald-500" />
                              <div>
                                <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">
                                  Meeting Request Sent Successfully!
                                </h4>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Your request has been logged. Divyanshu will verify calendar availability and send a Google Meet link within 24 hours.
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={handleGoogleCalendar}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface"
                              >
                                <CalendarIcon className="size-3.5" />
                                <span>Add to Google Calendar</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleDownloadIcs}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface"
                              >
                                <Download className="size-3.5" />
                                <span>Download .ics</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {bookingState === "error" && (
                              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
                                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-semibold">Notification failed</p>
                                  <p className="mt-0.5">{errorMessage}</p>
                                  <p className="mt-1.5 font-medium">
                                    You can instantly book directly via Cal.com below!
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                disabled={bookingState === "sending" || !canSubmit}
                                onClick={handleBookingSubmit}
                                className="inline-flex items-center gap-2.5 rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-background transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
                              >
                                {bookingState === "sending" ? (
                                  <>
                                    <RefreshCw className="size-3.5 animate-spin" />
                                    <span>Sending Request...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="size-3.5" />
                                    <span>Send Meeting Request</span>
                                  </>
                                )}
                              </button>

                              <a
                                href={calcomBookingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-surface"
                              >
                                <span>Direct Cal.com</span>
                                <ExternalLink className="size-3.5" />
                              </a>

                              <a
                                href="#live-ticket-pass"
                                className="inline-flex lg:hidden items-center gap-1.5 rounded-full border border-border bg-surface/40 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
                              >
                                <span>Live Pass ↓</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Right Column: Live Boarding Pass / Meeting Ticket (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="sticky top-28 space-y-6">
                    <Reveal delay={0.15}>
                      {/* Ticket Container */}
                      <div
                        id="live-ticket-pass"
                        className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface/80 via-background to-surface/40 p-5 sm:p-6 shadow-xl backdrop-blur-md"
                      >
                        {/* Shimmer Ambient Glow */}
                        <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-gradient-to-br from-blue-500/10 via-violet-500/5 to-transparent blur-3xl" />
                        <div className="pointer-events-none absolute -left-20 -bottom-20 size-60 rounded-full bg-gradient-to-tr from-emerald-500/10 to-transparent blur-3xl" />

                        {/* Ticket Header */}
                        <div className="flex items-center justify-between border-b border-border/80 pb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-foreground font-mono text-xs font-bold text-background">
                              DX
                            </div>
                            <div>
                              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-foreground">
                                Meeting Ticket Pass
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                REF: {ticketRefId}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[10px] font-mono font-medium">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{relativeDayLabel}</span>
                          </div>
                        </div>

                        {/* Format & Host row */}
                        <div className="mt-5 grid grid-cols-2 gap-4 border-b border-border/80 pb-5">
                          <div>
                            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              Session Type
                            </span>
                            <p className="mt-1 font-display text-sm font-bold text-foreground">
                              {selectedType.title}
                            </p>
                            <span className="mt-1 inline-block rounded-md border border-border bg-surface/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-foreground">
                              {selectedType.badge}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              Host
                            </span>
                            <p className="mt-1 font-display text-sm font-bold text-foreground">
                              Divyanshu Sharma
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              AI & Web Engineer
                            </p>
                          </div>
                        </div>

                        {/* Big Visual Date & Time Display */}
                        <div className="mt-5 rounded-2xl border border-border bg-background/80 p-4 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              Scheduled Window
                            </span>
                            <span className="text-[10px] font-mono text-foreground">
                              {activeTz.id} ({activeTz.flag})
                            </span>
                          </div>

                          <div className="mt-2 flex items-baseline justify-between">
                            <div className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                              {convertedTimeLabel}
                            </div>
                            <div className="text-right">
                              <p className="font-display text-sm font-semibold text-foreground">
                                {format(selectedDate, "MMM d, yyyy")}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {format(selectedDate, "EEEE")}
                              </p>
                            </div>
                          </div>

                          {timezone !== "IST" && (
                            <p className="mt-2 border-t border-border/60 pt-2 text-[10px] text-muted-foreground font-mono">
                              Host time: {time} IST (UTC+5:30)
                            </p>
                          )}
                        </div>

                        {/* Attendee Info */}
                        <div className="mt-5 space-y-1 rounded-xl border border-border/80 bg-surface/30 p-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Attendee:</span>
                            <span className="font-semibold text-foreground">
                              {name.trim() || "Guest Attendee"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Contact:</span>
                            <span className="font-mono text-muted-foreground">
                              {email.trim() || "Pending email address"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="text-foreground">Google Meet / Cal.com</span>
                          </div>
                        </div>

                        {/* Interactive Action Bar */}
                        <div className="mt-6 flex flex-col gap-2.5">
                          <button
                            type="button"
                            onClick={handleCopyInviteDetails}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface"
                          >
                            <Copy className="size-3.5" />
                            <span>Copy Meeting Details</span>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={handleGoogleCalendar}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface/40 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface"
                            >
                              <CalendarIcon className="size-3.5" />
                              <span>Google Cal</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleDownloadIcs}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface/40 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface"
                            >
                              <Download className="size-3.5" />
                              <span>Download .ICS</span>
                            </button>
                          </div>
                        </div>

                        {/* Simulated Barcode Decoration */}
                        <div className="mt-6 flex items-center justify-between border-t border-border/80 pt-4">
                          <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
                            <span>||| | | || ||| || ||| | ||| || |||</span>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            SECURE TICKET
                          </span>
                        </div>
                      </div>
                    </Reveal>

                    {/* Quick host notes card */}
                    <Reveal delay={0.2}>
                      <div className="rounded-2xl border border-border bg-surface/20 p-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                          <Zap className="size-3.5 text-amber-500" />
                          <span>Preparation Tip</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          Feel free to attach Figma files, GitHub PRs, or architecture specs directly in your message. Meetings take place over Google Meet with auto-generated links.
                        </p>
                      </div>
                    </Reveal>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
