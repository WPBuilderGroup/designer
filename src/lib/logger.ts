export type LogMeta = Record<string, unknown>

export const logger = {
  info: (message: string, meta: LogMeta = {}) => {
    console.info(JSON.stringify({ level: 'info', message, ...meta }))
  },
  error: (message: string, meta: LogMeta = {}) => {
    console.error(JSON.stringify({ level: 'error', message, ...meta }))
  }
}
