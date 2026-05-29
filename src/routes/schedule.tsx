import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Calendar } from "@/components/ui/calendar";
import { createFileRoute } from "@tanstack/react-router";
import { format, startOfToday } from "date-fns";
import { useEffect, useMemo, useState } from "react";

const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const backendBaseUrl = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

type BookingState = "idle" | "sending" | "sent" | "error";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [{ title: "Divyanshu Sharma — Schedule a meeting" }],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState(timeSlots[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Project introduction");
  const [clientTimeZone, setClientTimeZone] = useState<string | undefined>(undefined);
  const [bookingState, setBookingState] = useState<BookingState>("idle");
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "loading" | "ready" | "unavailable" | "error">("idle");
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const today = startOfToday();

  useEffect(() => {
    setDate(new Date());
    try {
      setClientTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setClientTimeZone(undefined);
    }
  }, []);

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
      ctz: clientTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [clientTimeZone, date, email, name, time, topic]);

  useEffect(() => {
    const selectedDate = date ?? new Date();
    const queryDate = format(selectedDate, "yyyy-MM-dd");

    const controller = new AbortController();
    setAvailabilityStatus("loading");

    void fetch(
      `${backendBaseUrl}/calendar/availability?date=${encodeURIComponent(queryDate)}&time_zone=${encodeURIComponent(clientTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone)}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("availability fetch failed");
        }

        return response.json() as Promise<{ busy_slots: string[] }>;
      })
      .then((data) => {
        setBusySlots(data.busy_slots ?? []);
        setAvailabilityStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setBusySlots([]);
        setAvailabilityStatus("error");
      });

    return () => controller.abort();
  }, [clientTimeZone, date]);

  function handleBookingClick() {
    setBookingState("sending");

    const selectedDate = date ?? new Date();
    const payload = {
      name: name.trim() || "Guest",
      email: email.trim() || null,
      date: format(selectedDate, "EEEE, MMMM d, yyyy"),
      time,
      topic: topic.trim() || "Meeting request",
      time_zone: clientTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      meeting_url: meetingUrl,
    };

    void fetch(`${backendBaseUrl}/booking/notify`, {
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

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-280 px-5 pb-20 pt-28 md:px-10 md:pt-32 lg:pl-28 xl:pl-36">
        <section className="container-edge pb-10">
          <SectionHeader
            index="01"
            eyebrow="Schedule"
            title="Pick a date, choose a time, and open the meeting in Google Calendar."
            description="This page uses the built-in calendar and a Google Calendar event template. When a meeting is opened, the backend sends you an email notification."
          />
        </section>

        <section className="border-t border-border bg-background py-20 md:py-24">
          <div className="container-edge space-y-8 md:space-y-12">
            <div>
              <p className="eyebrow mb-2">Meeting calendar</p>
              <p className="text-base text-muted-foreground">
                Choose a slot for a 30 minute conversation.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
              <Reveal>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-surface/30 p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Selected date</p>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {date ? format(date, "EEEE, MMMM d") : "Pick a date"}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-border bg-surface/20 p-3">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      fromMonth={today}
                      disabled={{ before: today }}
                      className="w-full"
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">Time slots</p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        disabled={busySlots.includes(slot)}
                        onClick={() => setTime(slot)}
                        className={`rounded-lg border px-3 py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors ${
                          busySlots.includes(slot)
                            ? "cursor-not-allowed border-border/60 bg-surface/20 text-muted-foreground opacity-60"
                            : time === slot
                            ? "border-accent bg-accent text-background"
                            : "border-border text-foreground hover:bg-surface/50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.05}>
              <div className="space-y-4 border-t border-border pt-8 md:pt-12">
                <p className="eyebrow mb-4">Booking details</p>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Name
                    </p>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                      placeholder="Your name"
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
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                      placeholder="you@example.com"
                    />
                  </label>

                  <label className="block">
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      Topic
                    </p>
                    <input
                      value={topic}
                      onChange={(event) => setTopic(event.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                      placeholder="What should we discuss?"
                    />
                  </label>
                </div>

                <div className="mt-6 rounded-lg border border-border bg-surface/30 p-4 text-sm leading-relaxed">
                  <p className="font-medium text-foreground">Selected slot</p>
                  <p className="mt-2 text-muted-foreground">
                    {date ? format(date, "EEEE, MMMM d") : "Pick a date"} at {time}
                  </p>
                  <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                    {availabilityStatus === "loading"
                      ? "Checking your calendar for open slots..."
                      : availabilityStatus === "error"
                        ? "Calendar availability could not be fetched. The booking link still works."
                        : busySlots.length > 0
                          ? `${busySlots.length} slots are already booked on this day.`
                          : "No conflicting events were found for the selected day."}
                  </p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                    {bookingState === "sending"
                      ? "Sending your booking email..."
                      : bookingState === "sent"
                        ? "Booking email sent. Check your inbox if you want to confirm it arrived."
                        : bookingState === "error"
                          ? "Email notification failed. The calendar link still opens, but the mailer needs setup."
                          : "Open Google Calendar to send the meeting request email and create the event."}
                  </p>
                </div>

                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleBookingClick}
                  className="inline-flex items-center gap-3 rounded-lg bg-accent px-5 py-3 text-[12px] font-medium uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90"
                >
                  Open Google Calendar
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}