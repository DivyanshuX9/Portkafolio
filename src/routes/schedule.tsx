import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Calendar } from "@/components/ui/calendar";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useMemo, useState } from "react";

const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Schedule a meeting" }],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(timeSlots[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Project introduction");

  const googleCalendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID as string | undefined;
  const googleCalendarApiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY as string | undefined;

  const meetingUrl = useMemo(() => {
    const selectedDate = date ?? new Date();
    const [hours, minutes] = time.split(":").map(Number);
    const start = new Date(selectedDate);
    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `${topic} with Divyanshu Sharma`,
      details: [
        `Booked by: ${name || "Guest"}`,
        email ? `Email: ${email}` : "",
        "Video or meeting link will be shared after confirmation.",
      ]
        .filter(Boolean)
        .join("\n"),
      dates: `${format(start, "yyyyMMdd'T'HHmmss")}/${format(end, "yyyyMMdd'T'HHmmss")}`,
      ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [date, email, name, time, topic]);

  const calendarSyncHint =
    googleCalendarId && googleCalendarApiKey
      ? "Google Calendar API credentials are present. You can wire a public calendar sync with the calendar ID for live availability."
      : "Set VITE_GOOGLE_CALENDAR_ID and VITE_GOOGLE_CALENDAR_API_KEY to sync public availability with Google Calendar.";

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-280 px-5 pt-28 pb-20 md:px-10 md:pt-32 md:pl-16 lg:pl-28 xl:pl-36">
        <section className="container-edge pb-10">
          <SectionHeader
            index="01"
            eyebrow="Schedule"
            title="Pick a date, choose a time, and open the meeting in Google Calendar."
            description="This page uses the built-in calendar and a Google Calendar event template. Public availability can be synced when the API key and calendar ID are provided."
          />
        </section>

        <section className="container-edge grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="rounded-4xl border border-ink-deep/12 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.28)] md:p-6">
            <div className="flex items-center justify-between border-b border-ink-deep/10 pb-4">
              <div>
                <p className="eyebrow">Meeting calendar</p>
                <p className="mt-2 text-sm opacity-60">Choose a slot for a 30 minute conversation.</p>
              </div>
              <span className="rounded-full border border-ink-deep/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] opacity-60">
                {date ? format(date, "MMM d, yyyy") : "Select a date"}
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-ink-deep/10 bg-background/50 p-3">
              <Calendar mode="single" selected={date} onSelect={setDate} className="w-full" />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`rounded-full border px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors ${
                    time === slot
                      ? "border-ink-deep bg-ink-deep text-background"
                      : "border-ink-deep/15 bg-transparent text-ink-deep hover:bg-ink-deep/5"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05} className="rounded-4xl border border-ink-deep/12 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.28)] md:p-6">
            <p className="eyebrow">Booking details</p>

            <div className="mt-5 space-y-4">
              <label className="block text-[11px] uppercase tracking-[0.18em] opacity-60">
                Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-full border border-ink-deep/15 bg-background px-4 py-3 text-sm text-ink-deep outline-none transition-colors placeholder:text-ink-deep/40 focus:border-ink-deep"
                  placeholder="Your name"
                />
              </label>

              <label className="block text-[11px] uppercase tracking-[0.18em] opacity-60">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-full border border-ink-deep/15 bg-background px-4 py-3 text-sm text-ink-deep outline-none transition-colors placeholder:text-ink-deep/40 focus:border-ink-deep"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-[11px] uppercase tracking-[0.18em] opacity-60">
                Topic
                <input
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="mt-2 w-full rounded-full border border-ink-deep/15 bg-background px-4 py-3 text-sm text-ink-deep outline-none transition-colors placeholder:text-ink-deep/40 focus:border-ink-deep"
                  placeholder="What should we discuss?"
                />
              </label>
            </div>

            <div className="mt-6 rounded-3xl border border-ink-deep/10 bg-background/60 p-4 text-sm leading-relaxed">
              <p className="font-medium text-ink-deep">Selected slot</p>
              <p className="mt-2 opacity-70">
                {date ? format(date, "EEEE, MMMM d") : "Pick a date"} at {time}
              </p>
              <p className="mt-3 text-[12px] uppercase tracking-[0.18em] opacity-55">
                {calendarSyncHint}
              </p>
            </div>

            <a
              href={meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-ink-deep px-5 py-3 text-[12px] font-medium uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-85"
            >
              Open Google Calendar
              <span aria-hidden>↗</span>
            </a>
          </Reveal>
        </section>
      </main>
    </div>
  );
}