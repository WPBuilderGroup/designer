import { NextRequest, NextResponse } from 'next/server'
import { query, Tenant } from '@/lib/db'
import { safeJson } from '@/lib/api'

const tenantSchema = {
  safeParse(input: any) {
    const name = typeof input?.name === 'string' ? input.name.trim() : ''
    const slug = typeof input?.slug === 'string' ? input.slug.trim() : ''
    const slugRegex = /^[a-z0-9-]+$/

    if (!name) {
      return { success: false, error: 'name is required' as const }
    }

    if (!slug || !slugRegex.test(slug)) {
      return {
        success: false,
        error: 'slug must be lowercase letters, numbers, and hyphens' as const,
      }
    }

    return { success: true, data: { name, slug } } as const
  },
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
        error: 'Failed to fetch tenants',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const [body, jsonError] = await safeJson(req)
  if (jsonError) return jsonError

  const parsed = tenantSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { name, slug } = parsed.data

  try {
    await query('INSERT INTO tenants(slug, name) VALUES($1, $2)', [slug, name])
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Error creating tenant:', error)

    if (error?.code === '23505') {
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
