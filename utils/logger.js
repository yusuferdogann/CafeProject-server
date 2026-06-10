import { env } from "../config/env.js";

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = env.isProd ? LEVELS.info : LEVELS.debug;

function write(level, message, meta = {}) {
  if (LEVELS[level] > currentLevel) return;

  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  error: (message, meta) => write("error", message, meta),
  warn: (message, meta) => write("warn", message, meta),
  info: (message, meta) => write("info", message, meta),
  debug: (message, meta) => write("debug", message, meta),
  child: (meta) => ({
    error: (message, extra) => write("error", message, { ...meta, ...extra }),
    warn: (message, extra) => write("warn", message, { ...meta, ...extra }),
    info: (message, extra) => write("info", message, { ...meta, ...extra }),
    debug: (message, extra) => write("debug", message, { ...meta, ...extra }),
  }),
};
