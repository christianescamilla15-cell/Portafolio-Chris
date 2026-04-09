// ─── CALENDAR STATE MANAGEMENT ───────────────────────────────────────────────

const CALENDAR_KEY = "content-studio-calendar";

function loadCalendarData() {
  try {
    return JSON.parse(localStorage.getItem(CALENDAR_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCalendarData(data) {
  localStorage.setItem(CALENDAR_KEY, JSON.stringify(data));
}

export function addToCalendar(date, content) {
  const data = loadCalendarData();
  if (!data[date]) data[date] = [];
  data[date].push({
    ...content,
    addedAt: new Date().toISOString(),
  });
  saveCalendarData(data);
  return data;
}

export function removeFromCalendar(date, index) {
  const data = loadCalendarData();
  if (data[date] && data[date][index] !== undefined) {
    data[date].splice(index, 1);
    if (data[date].length === 0) delete data[date];
  }
  saveCalendarData(data);
  return data;
}

export function getEntriesForDate(date) {
  const data = loadCalendarData();
  return data[date] || [];
}

export function getAllCalendarData() {
  return loadCalendarData();
}

export function clearCalendarData() {
  localStorage.removeItem(CALENDAR_KEY);
  return {};
}
