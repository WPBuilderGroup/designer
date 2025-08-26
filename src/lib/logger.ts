export type LogMeta = Record<string, unknown>

function log(level: 'info' | 'warn' | 'error', message: string, meta?: LogMeta) {
  const entry = { level, message, ...(meta ?? {}) }
  if (level === 'error') {
    console.error(JSON.stringify(entry))
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry))
  } else {
    console.info(JSON.stringify(entry))
  }
}

export const logger = {
  info: (message: string, meta?: LogMeta) => log('info', message, meta),
  warn: (message: string, meta?: LogMeta) => log('warn', message, meta),
  error: (message: string, meta?: LogMeta) => log('error', message, meta)
}
