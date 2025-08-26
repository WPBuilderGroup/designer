export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const levelOrder: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const currentLevel: LogLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'warn'

function log(level: LogLevel, ...args: unknown[]) {
  if (levelOrder[level] < levelOrder[currentLevel]) return
  const fn = level === 'warn' ? console.warn : level === 'error' ? console.error : console.log
  fn(...(args as unknown[]))
}

export const logger = {
  debug: (...args: unknown[]) => log('debug', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args)
}
