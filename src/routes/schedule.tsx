import { Reveal } from "@/components/site/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { createFileRoute } from "@tanstack/react-router";
import { format, startOfToday } from "date-fns";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

const Calendar = lazy(() =>
  import("@/components/ui/calendar").then((module) => ({
    default: module.Calendar,
  })),
);

const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const sectionOptions = [
  "Project inquiry",
  "Collaboration",
  "Speaking",
  "Hiring",
  "Other",
] as const;

const backendBaseUrl =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState(timeSlots[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [section, setSection] =
    useState<(typeof sectionOptions)[number]>("Project inquiry");
  const [topic, setTopic] = useState("Project introduction");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [clientTimeZone, setClientTimeZone] = useState<string | undefined>(
    undefined,
  );
  const [bookingState, setBookingState] = useState<BookingState>("idle");
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "idle" | "loading" | "ready" | "unavailable" | "error"
  >("idle");
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
        `Section: ${section}`,
        subject ? `Subject: ${subject}` : "",
        body ? `Message: ${body}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      dates: `${format(start, "yyyyMMdd'T'HHmmss")}/${format(end, "yyyyMMdd'T'HHmmss")}`,
      ctz: clientTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [body, clientTimeZone, date, email, name, section, subject, time, topic]);

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

        return response.json() as Promise<{
          busy_slots: string[];
          available_slots: string[];
        }>;
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
      date: format(selectedDate, "yyyy-MM-dd"),
      time,
      section,
      topic: topic.trim() || "Meeting request",
      subject:
        subject.trim() || `${section} on ${format(selectedDate, "MMMM d")}`,
      body: body.trim() || "I'd like to schedule a meeting.",
      time_zone:
        clientTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
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

  const selectedSlotBusy = busySlots.includes(time);
  const emailLooksValid = email.trim() === "" || isValidEmail(email.trim());
  const canSubmit =
    availabilityStatus !== "loading" &&
    !selectedSlotBusy &&
    emailLooksValid &&
    Boolean(subject.trim()) &&
    Boolean(body.trim());

  return (
    <div className="relative min-h-dvh bg-background text-foreground transition-colors duration-700">
      <main className="relative z-10 mx-auto w-full max-w-280 px-5 pb-20 pt-28 md:px-10 md:pt-32 lg:pl-28 xl:pl-36">
        <section className="container-edge pb-10">
          <SectionHeader
            index="01"
            eyebrow="Schedule"
            title="Pick a date, choose a time, and send a proper meeting request."
            description="The form checks your calendar first, rejects busy slots, and sends a notification email when someone books time with you."
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
                      <p className="text-sm font-medium text-foreground">
                        Selected date
                      </p>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {date ? format(date, "EEEE, MMMM d") : "Pick a date"}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-border bg-surface/20 p-3">
                    <Suspense
                      fallback={
                        <div className="grid min-h-80 place-items-center rounded-lg border border-border/60 bg-surface/20 text-sm text-muted-foreground">
                          Loading calendar...
                        </div>
                      }
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        fromMonth={today}
                        disabled={{ before: today }}
                        className="w-full"
                      />
                    </Suspense>
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
                    {date ? format(date, "EEEE, MMMM d") : "Pick a date"} at{" "}
                    {time}
                  </p>
                  <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
                    {availabilityStatus === "loading"
                      ? "Checking your calendar for open slots..."
                      : availabilityStatus === "error"
                        ? "Calendar availability could not be fetched. The form still lets you send a request."
                        : selectedSlotBusy
                          ? "That slot is already booked. Pick another time."
                          : busySlots.length > 0
                            ? `${busySlots.length} slots are already booked on this day.`
                            : "No conflicting events were found for the selected day."}
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
                              : "The notification will be sent after your slot passes validation."}
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
                    href={meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-lg border border-border px-5 py-3 text-[12px] font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-surface/50"
                  >
                    Open Google Calendar
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
