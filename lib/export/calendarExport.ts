import { EventInput, EventPlan } from "@/lib/schemas/event";

function formatDateToICS(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatDateTimeToICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICSText(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function generateICSContent(input: EventInput, plan: EventPlan): string {
  const nowStr = formatDateTimeToICS(new Date());

  // Parse event date
  const [targetYear, targetMonth, targetDay] = input.eventDate.split("-").map(Number);
  const targetDate = new Date(targetYear, targetMonth - 1, targetDay);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gatherly//AI Event Orchestration Engine//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Gatherly - ${input.eventType} Roadmap`,
    "X-WR-TIMEZONE:UTC",
  ];

  // 1. Add Main Event Celebration VEVENT
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  lines.push("BEGIN:VEVENT");
  lines.push(`UID:gatherly-event-${Date.now()}@gatherly.ai`);
  lines.push(`DTSTAMP:${nowStr}`);
  lines.push(`DTSTART;VALUE=DATE:${formatDateToICS(targetDate)}`);
  lines.push(`DTEND;VALUE=DATE:${formatDateToICS(nextDay)}`);
  lines.push(`SUMMARY:${escapeICSText(`🎉 ${input.eventType} (${input.locationVibe})`)}`);
  lines.push(
    `DESCRIPTION:${escapeICSText(
      `Gatherly Master Event Celebration\\nStrategy: ${plan.eventSummary}\\nGuest Count: ${input.guestCount}\\nBudget: $${input.totalBudget.toLocaleString()}`
    )}`
  );
  lines.push("STATUS:CONFIRMED");
  lines.push("TRANSP:TRANSPARENT");
  lines.push("END:VEVENT");

  // 2. Add Milestones as individual calendar milestones
  const phases = plan.timelineMilestones;
  const numPhases = phases.length;

  phases.forEach((phase, index) => {
    // Distribute phases between today and target date
    const phaseDate = new Date(today);
    if (input.daysRemaining > 0 && numPhases > 1) {
      const stepDays = Math.floor((input.daysRemaining * index) / (numPhases - 1));
      phaseDate.setDate(today.getDate() + stepDays);
    } else {
      phaseDate.setDate(today.getDate());
    }

    const phaseNextDay = new Date(phaseDate);
    phaseNextDay.setDate(phaseNextDay.getDate() + 1);

    const taskListText = phase.tasks
      .map((t) => (t.isCompleted ? `[X] ${t.taskName}` : `[ ] ${t.taskName}`))
      .join("\\n");

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:gatherly-phase-${index}-${Date.now()}@gatherly.ai`);
    lines.push(`DTSTAMP:${nowStr}`);
    lines.push(`DTSTART;VALUE=DATE:${formatDateToICS(phaseDate)}`);
    lines.push(`DTEND;VALUE=DATE:${formatDateToICS(phaseNextDay)}`);
    lines.push(`SUMMARY:${escapeICSText(`📋 Milestone: ${phase.phase}`)}`);
    lines.push(
      `DESCRIPTION:${escapeICSText(
        `Action Items for ${phase.phase}:\\n${taskListText}\\n\\nEvent: ${input.eventType} (${input.eventDate})`
      )}`
    );
    lines.push("STATUS:CONFIRMED");
    lines.push("TRANSP:TRANSPARENT");
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

export function downloadCalendarFile(input: EventInput, plan: EventPlan): void {
  const icsString = generateICSContent(input, plan);
  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gatherly-${input.eventType.toLowerCase()}-milestones.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
