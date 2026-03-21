// lib/availability.ts

// Service duration in minutes
export const SERVICE_DURATION = 75; // Korean Lash Lift = 1h15

// Business working hours
// 0 = Sunday
// 1 = Monday
// 2 = Tuesday
// 3 = Wednesday
// 4 = Thursday
// 5 = Friday
// 6 = Saturday

export const WORKING_HOURS: Record<number, { start: string; end: string } | null> = {
  0: null, // Sunday CLOSED
  1: { start: "10:00", end: "18:00" }, // Monday
  2: { start: "10:00", end: "18:00" }, // Tuesday
  3: null, // Wednesday CLOSED
  4: { start: "10:00", end: "18:00" }, // Thursday
  5: { start: "10:00", end: "18:00" }, // Friday
  6: { start: "10:00", end: "16:00" } // Saturday
};

// Convert HH:MM → minutes
function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Convert minutes → HH:MM
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Generate available time slots for a given day
export function generateTimeSlots(dayOfWeek: number): string[] {
  const schedule = WORKING_HOURS[dayOfWeek];

  if (!schedule) return [];

  const start = timeToMinutes(schedule.start);
  const end = timeToMinutes(schedule.end);

  const slots: string[] = [];

  let current = start;

  while (current + SERVICE_DURATION <= end) {
    slots.push(minutesToTime(current));

    // 15 minute interval between possible starts
    current += 15;
  }

  return slots;
}

// Remove booked slots
export function filterBookedSlots(
  slots: string[],
  bookedSlots: string[]
): string[] {
  return slots.filter((slot) => !bookedSlots.includes(slot));
}

// Check if two bookings overlap
export function isSlotOverlapping(
  requestedTime: string,
  existingTimes: string[]
): boolean {
  const requestedStart = timeToMinutes(requestedTime);
  const requestedEnd = requestedStart + SERVICE_DURATION;

  for (const existing of existingTimes) {
    const existingStart = timeToMinutes(existing);
    const existingEnd = existingStart + SERVICE_DURATION;

    const overlap =
      requestedStart < existingEnd && requestedEnd > existingStart;

    if (overlap) return true;
  }

  return false;
}