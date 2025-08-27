import { NextRequest, NextResponse } from 'next/server'
import { query, Tenant } from '@/lib/db'
import { safeJson } from '@/lib/api'

const tenantSchema = {
  parse(data: unknown): { name: string; slug: string } {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON payload')
    }

    const { name, slug } = data as { name?: unknown; slug?: unknown }

    if (typeof name !== 'string' || !name.trim()) {
      throw new Error('Name is required')
    }

    if (typeof slug !== 'string' || !slug.trim()) {
      throw new Error('Slug is required')
    }

    const trimmedSlug = slug.trim()
    if (!/^[a-z0-9-]+$/.test(trimmedSlug)) {
      throw new Error('Slug must contain only lowercase letters, numbers, and hyphens')
    }

    return { name: name.trim(), slug: trimmedSlug }
  }
}

export async function GET() {
  try {
    const { rows } = await query<Tenant>(
      'SELECT id, slug, name FROM tenants ORDER BY created_at DESC'
    )
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json(
      {
        error: 'Failed to load tenants',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const [body, jsonError] = await safeJson(req)
  if (jsonError) return jsonError

  let validated: { name: string; slug: string }

  try {
    validated = tenantSchema.parse(body)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Invalid request body',
      },
      { status: 400 }
    )
  }

  const { name, slug } = validated

  try {
    await query('INSERT INTO tenants(slug, name) VALUES($1, $2)', [slug, name])
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Error creating tenant:', error)

    if (error?.code === '23505') {
      return NextResponse.json(
        { error: 'Tenant slug already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to create tenant',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
