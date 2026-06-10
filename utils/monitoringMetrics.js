const startedAt = Date.now();
const recentEvents = [];
const MAX_EVENTS = 50;

export function getUptimeSeconds() {
  return Math.floor((Date.now() - startedAt) / 1000);
}

export function recordMonitoringEvent(level, message, meta = {}) {
  recentEvents.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    level,
    message,
    time: new Date().toISOString(),
    ...meta,
  });

  if (recentEvents.length > MAX_EVENTS) {
    recentEvents.length = MAX_EVENTS;
  }
}

export function getRecentEvents() {
  return recentEvents;
}
