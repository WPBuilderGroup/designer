import { NextResponse } from 'next/server'

/**
 * Safely parse JSON from a Request. Returns a tuple of [data, errorResponse].
 * If parsing fails, errorResponse is a NextResponse with status 400.
 */
export async function safeJson<T = unknown>(request: Request): Promise<[T, NextResponse | null]> {
  try {
    const data = await request.json()
    return [data as T, null]
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return [null as unknown as T, NextResponse.json({ error: 'Invalid JSON', message }, { status: 400 })]
  }
}
