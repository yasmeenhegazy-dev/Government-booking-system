// In-memory ring buffer for admin activity logs. Resets on server restart.
// Kept simple by design — production would persist to a collection or external
// log sink, but for the demo this is enough to surface recent admin actions.

const MAX_LOGS = 200;
const logs = [];

function logAction(action, meta = {}) {
  logs.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    meta,
    at: new Date().toISOString(),
  });
  if (logs.length > MAX_LOGS) logs.length = MAX_LOGS;
}

function recentLogs(limit = MAX_LOGS) {
  return logs.slice(0, limit);
}

module.exports = { logAction, recentLogs };
