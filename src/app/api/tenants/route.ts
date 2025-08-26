import { NextRequest, NextResponse } from 'next/server'
import { query, Tenant } from '@/lib/db'

// Simple schema validation
const tenantSchema = {
  parse(data: unknown) {
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
      'select id, slug, name from tenants order by created_at desc'
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
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  let validated
  try {
    validated = tenantSchema.parse(body)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid request body' },
      { status: 400 }
    )
  }

  const { name, slug } = validated

  try {
    await query('insert into tenants(slug, name) values($1,$2)', [slug, name])
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Error creating tenant:', error)

    // PostgreSQL unique_violation
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'Tenant slug already exists' }, { status: 409 })
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
