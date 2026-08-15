import { PageHeaderHero } from "@/components/site/PageHeaderHero";
import { Reveal } from "@/components/site/Reveal";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState } from "react";

const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const sectionOptions = [
  "Project inquiry",
  "Collaboration",
  "Speaking",
  "Hiring",
  "Other",
] as const;

const calcomUsername = import.meta.env.VITE_CALCOM_USERNAME ?? "divyanshu-sharmax9";
const calcomBookingUrl = `https://cal.com/${calcomUsername}`;

type BookingState = "idle" | "sending" | "sent" | "error";

function isValidEmail(value: string) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value);
}

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma - Schedule a meeting" }],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(timeSlots[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [section, setSection] =
    useState<(typeof sectionOptions)[number]>("Project inquiry");
  const [topic, setTopic] = useState("Project introduction");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [bookingState, setBookingState] = useState<BookingState>("idle");

  function handleBookingClick() {
    setBookingState("sending");

    const selectedDate = date ?? new Date();
    const payload = {
      name: name.trim() || "Guest",
      email: email.trim() || null,
      date: format(selectedDate, "yyyy-MM-dd"),
      time,
      section,
      topic: topic.trim() || "Meeting request",
      subject:
        subject.trim() || `${section} on ${format(selectedDate, "MMMM d")}`,
      body: body.trim() || "I'd like to schedule a meeting.",
      meeting_url: calcomBookingUrl,
    };

    void fetch("/api/booking/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then((response) => {
        setBookingState(response.ok ? "sent" : "error");
      })
      .catch(() => {
        setBookingState("error");
      });
  }

  const emailLooksValid = email.trim() === "" || isValidEmail(email.trim());
  const canSubmit = emailLooksValid && Boolean(subject.trim()) && Boolean(body.trim());

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-7xl pb-20">
        <PageHeaderHero
          sectionIndex="01"
          eyebrow="Schedule"
          breadcrumb={[
            { label: "Home", href: "/" },
            { label: "Schedule" },
          ]}
          title="Book a 1-on-1 session or meeting."
          description="Schedule a time for project inquiries, technical collaboration, speaking engagements, or hiring discussions via direct Cal.com calendar sync."
          stats={[
            { label: "Session Duration", value: "30 Mins", badgeType: "session" },
            { label: "Timezone", value: "IST (UTC+5:30)", badgeType: "timezone" },
            { label: "Availability", value: "Live Cal.com Sync", badgeType: "stack" },
            { label: "Response Time", value: "< 24 Hours", badgeType: "response" },
          ]}
        />

        <section className="border-t border-border bg-background py-16 md:py-20">
          <div className="container-edge space-y-8 md:space-y-12">
            <div>
              <p className="eyebrow mb-2">Meeting calendar</p>
              <p className="text-base text-muted-foreground">
                Cal.com is the source of truth for live availability.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
              <Reveal>
                <div className="space-y-4 rounded-lg border border-border bg-surface/20 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Cal.com booking
                      </p>
                      <p className="mt-1 max-w-96 text-[13px] leading-relaxed text-muted-foreground">
                        Open the booking page for live availability and instant scheduling.
                      </p>
                    </div>
                    <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Live
                    </span>
                  </div>

                  <a
                    href={calcomBookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-full border border-border px-5 py-3 text-[12px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-surface/50"
                  >
                    Open Cal.com
                    <span aria-hidden>↗</span>
                  </a>

                  <div className="rounded-lg border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Selected slot</p>
                    <p className="mt-2">
                      {date ? format(date, "EEEE, MMMM d") : "Pick a date"} at {time}
                    </p>
                    <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                      Use Cal.com to confirm the final availability.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">
                    Time slots
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`rounded-lg border px-3 py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors ${
                          time === slot
                            ? "border-accent bg-accent text-background"
                            : "border-border text-foreground hover:bg-surface/50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <p className="rounded-lg border border-border bg-surface/20 p-4 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                    Tip: pick a rough time here, then confirm the real slot on Cal.com.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.05}>
              <div className="space-y-4 border-t border-border pt-8 md:pt-12">
                <p className="eyebrow mb-4">Booking details</p>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <label className="block">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Name
                    </p>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
                    />
                  </label>

                  <label className="block">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Email
                    </p>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
                    />
                  </label>

                  <label className="block">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Section
                    </p>
                    <select
                      value={section}
                      onChange={(event) =>
                        setSection(
                          event.target.value as (typeof sectionOptions)[number],
                        )
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
                    >
                      {sectionOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Topic
                    </p>
                    <input
                      value={topic}
                      onChange={(event) => setTopic(event.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
                    />
                  </label>

                  <label className="block">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Subject
                    </p>
                    <input
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
                    />
                  </label>

                  <label className="block md:col-span-2 xl:col-span-3">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Body
                    </p>
                    <textarea
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                      rows={5}
                      className="w-full rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                    />
                  </label>
                </div>

                <div className="mt-6 rounded-lg border border-border bg-surface/30 p-4 text-sm leading-relaxed">
                  <p className="font-medium text-foreground">Selected slot</p>
                  <p className="mt-2 text-muted-foreground">
                    {date ? format(date, "EEEE, MMMM d") : "Pick a date"} at {time}
                  </p>
                  <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                    Cal.com handles live availability. Your form message still gets sent as a backup.
                  </p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                    {bookingState === "sending"
                      ? "Sending your booking email..."
                      : bookingState === "sent"
                        ? "Booking email sent. Check your inbox for the notification."
                        : bookingState === "error"
                          ? "Email notification failed. Please try again."
                          : !emailLooksValid
                            ? "Enter a valid email address."
                            : !subject.trim() || !body.trim()
                              ? "Add a subject and message before sending."
                              : "The notification will be sent after you confirm on Cal.com."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={handleBookingClick}
                    className="inline-flex items-center gap-3 rounded-lg bg-accent px-5 py-3 text-[12px] font-medium uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Send meeting request
                    <span aria-hidden>→</span>
                  </button>

                  <a
                    href={calcomBookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-lg border border-border px-5 py-3 text-[12px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-surface/50"
                  >
                    Open Cal.com
                    <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
