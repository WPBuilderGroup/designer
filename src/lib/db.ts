// lib/db.ts
import { Pool, PoolClient } from 'pg'
import { logger } from '@/lib/logger'

declare global {
  // eslint-disable-next-line no-var
  var __PG_POOL__: Pool | undefined
}

// Global connection pool (dev-safe via globalThis)
let globalPool: Pool | null = null

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  pool.on('error', (err: unknown) => {
    logger.error('Unexpected error on idle client', err)
  })

  logger.info('Database pool initialized successfully')
  return pool
}

// Database connection configuration
export function getPool(): Pool {
  if (globalPool) return globalPool

  if (process.env.NODE_ENV !== 'production') {
    if (!global.__PG_POOL__) {
      global.__PG_POOL__ = createPool()
    }
    globalPool = global.__PG_POOL__
  } else {
    globalPool = createPool()
  }

  return globalPool!
}

// Generic query function with proper error handling
export type QueryParam = string | number | boolean | null | Date | Uint8Array

export async function query<T = unknown>(
  text: string,
  params?: QueryParam[]
): Promise<{ rows: T[]; rowCount: number }> {
  const pool = getPool()
  const start = Date.now()
  try {
    const result = await pool.query<T>(text, params as any[])
    const duration = Date.now() - start

    if (process.env.NODE_ENV === 'development') {
      logger.info('Query executed:', { text, duration: `${duration}ms`, rows: result.rowCount })
    }

    return {
      rows: result.rows,
      rowCount: result.rowCount ?? 0,
    }
  } catch (error) {
    logger.error('Database query error:', error)
    logger.error('Query:', text)
    logger.error('Params:', params)
    throw error
  }
}

// Transaction helper
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    try {
      await client.query('ROLLBACK')
    } catch (rollbackErr) {
      logger.error('Error during transaction rollback:', rollbackErr)
    }
    throw error
  } finally {
    client.release()
  }
}

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    await query('SELECT 1 as health_check')
    return true
  } catch (error) {
    logger.error('Database health check failed:', error)
    return false
  }
}

// Close pool gracefully
export async function closePool(): Promise<void> {
  if (globalPool) {
    await globalPool.end()
    if (process.env.NODE_ENV !== 'production') {
      global.__PG_POOL__ = undefined
    }
    globalPool = null
    logger.info('Database pool closed')
  }
}

// Types for our database schema
export interface GjsComponent {
  type: string
  components?: GjsComponent[]
  [key: string]: unknown
}

export interface GjsStyle {
  selectors?: { name: string }[] | string[]
  style?: Record<string, string | number>
  [key: string]: unknown
}

export interface PageData {
  id: string
  project_id: string
  slug: string
  gjs_html?: string | null
  gjs_css?: string | null
  gjs_components?: GjsComponent[] | null
  gjs_styles?: GjsStyle[] | null
  updated_at: string
}

export interface Project {
  id: string
  tenant_id: string
  slug: string
  name: string
  created_at: string
}

export interface Tenant {
  id: string
  slug: string
  name: string
  created_at: string
}

export interface ProjectWithPageCount extends Project {
  page_count: number
}

// Get page data
export async function getPageData(projectSlug: string, pageSlug: string): Promise<PageData | null> {
  try {
    const projectQuery = `SELECT id FROM projects WHERE slug = $1 LIMIT 1`
    const projectResult = await query<{ id: string }>(projectQuery, [projectSlug])

    if (projectResult.rows.length === 0) {
      logger.warn(`Project not found: ${projectSlug}`)
      return null
    }

    const projectId = projectResult.rows[0].id

    const pageQuery = `
      SELECT id, project_id, slug, gjs_html, gjs_css, gjs_components, gjs_styles, updated_at
      FROM pages 
      WHERE project_id = $1 AND slug = $2
      LIMIT 1
    `
    const pageResult = await query<PageData>(pageQuery, [projectId, pageSlug])

    if (pageResult.rows.length === 0) {
      logger.warn(`Page not found: ${projectSlug}/${pageSlug}`)
      return null
    }

    return pageResult.rows[0]
  } catch (error) {
    logger.error('Error getting page data:', error)
    throw error
  }
}

export interface GrapesJSPageContent {
  'gjs-html'?: string
  'gjs-css'?: string
  'gjs-components'?: GjsComponent[]
  'gjs-styles'?: GjsStyle[]
}

export async function upsertPageData(
  projectSlug: string,
  pageSlug: string,
  data: GrapesJSPageContent
): Promise<boolean> {
  try {
    return await transaction(async (client) => {
      const projectQuery = `SELECT id FROM projects WHERE slug = $1 LIMIT 1`
      const projectResult = await client.query<{ id: string }>(projectQuery, [projectSlug])

      if (projectResult.rows.length === 0) {
        logger.warn(`Project not found: ${projectSlug}`)
        return false
      }

      const projectId = projectResult.rows[0].id

      const upsertQuery = `
        INSERT INTO pages (project_id, slug, gjs_html, gjs_css, gjs_components, gjs_styles, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (project_id, slug)
        DO UPDATE SET
          gjs_html = EXCLUDED.gjs_html,
          gjs_css = EXCLUDED.gjs_css,
          gjs_components = EXCLUDED.gjs_components,
          gjs_styles = EXCLUDED.gjs_styles,
          updated_at = NOW()
        RETURNING id
      `

      const result = await client.query(upsertQuery, [
        projectId,
        pageSlug,
        data['gjs-html'] ?? null,
        data['gjs-css'] ?? null,
        data['gjs-components'] ? JSON.stringify(data['gjs-components']) : null,
        data['gjs-styles'] ? JSON.stringify(data['gjs-styles']) : null,
      ])

      logger.info(`Page upserted successfully: ${projectSlug}/${pageSlug}`)
      return result.rows.length > 0
    })
  } catch (error) {
    logger.error('Error upserting page data:', error)
    throw error
  }
}

export async function getProjectsByWorkspace(workspaceSlug: string): Promise<ProjectWithPageCount[]> {
  try {
    const query_text = `
      SELECT p.id, p.tenant_id, p.slug, p.name, p.created_at,
             COUNT(pages.id) as page_count
      FROM projects p
      JOIN tenants t ON p.tenant_id = t.id
      LEFT JOIN pages ON pages.project_id = p.id
      WHERE t.slug = $1
      GROUP BY p.id, p.tenant_id, p.slug, p.name, p.created_at
      ORDER BY p.created_at DESC
    `
    const result = await query<Project & { page_count: string }>(query_text, [workspaceSlug])

    return result.rows.map<ProjectWithPageCount>((row) => ({
      id: row.id,
      tenant_id: row.tenant_id,
      slug: row.slug,
      name: row.name,
      created_at: row.created_at,
      page_count: Number.parseInt(row.page_count, 10) || 0,
    }))
  } catch (error) {
    logger.error('Error getting projects by workspace:', error)
    throw error
  }
}

export async function createProject(
  workspaceSlug: string,
  projectSlug: string,
  projectName: string
): Promise<Project | null> {
  try {
    return await transaction(async (client) => {
      const tenantQuery = `SELECT id FROM tenants WHERE slug = $1 LIMIT 1`
      const tenantResult = await client.query<{ id: string }>(tenantQuery, [workspaceSlug])

      let tenantId: string
      if (tenantResult.rows.length === 0) {
        const createTenantQuery = `
          INSERT INTO tenants (slug, name, created_at) 
          VALUES ($1, $2, NOW()) 
          RETURNING id
        `
        const newTenantResult = await client.query<{ id: string }>(createTenantQuery, [
          workspaceSlug,
          workspaceSlug,
        ])
        tenantId = newTenantResult.rows[0].id
        logger.info(`Created new tenant: ${workspaceSlug}`)
      } else {
        tenantId = tenantResult.rows[0].id
      }

      const createProjectQuery = `
        INSERT INTO projects (tenant_id, slug, name, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, tenant_id, slug, name, created_at
      `
      const projectResult = await client.query<Project>(createProjectQuery, [
        tenantId,
        projectSlug,
        projectName,
      ])

      if (projectResult.rows.length === 0) {
        return null
      }

      logger.info(`Project created successfully: ${projectSlug}`)
      return projectResult.rows[0]
    })
  } catch (error) {
    logger.error('Error creating project:', error)
    throw error
  }
}

export async function getPagesByProject(projectSlug: string): Promise<(PageData & { has_content: boolean })[]> {
  try {
    const projectQuery = `SELECT id FROM projects WHERE slug = $1 LIMIT 1`
    const projectResult = await query<{ id: string }>(projectQuery, [projectSlug])

    if (projectResult.rows.length === 0) {
      throw new Error(`Project not found: ${projectSlug}`)
    }

    const projectId = projectResult.rows[0].id

    const pagesQuery = `
      SELECT id, project_id, slug, updated_at,
             CASE 
               WHEN gjs_html IS NOT NULL AND gjs_html != '' THEN true
               ELSE false
             END as has_content
      FROM pages 
      WHERE project_id = $1
      ORDER BY 
        CASE WHEN slug = 'home' THEN 0 ELSE 1 END,
        updated_at DESC
    `
    const pagesResult = await query<PageData & { has_content: boolean }>(pagesQuery, [projectId])

    return pagesResult.rows
  } catch (error) {
    logger.error('Error getting pages by project:', error)
    throw error
  }
}

export async function createPage(projectSlug: string, pageSlug: string): Promise<PageData | null> {
  try {
    return await transaction(async (client) => {
      const projectQuery = `SELECT id FROM projects WHERE slug = $1 LIMIT 1`
      const projectResult = await client.query<{ id: string }>(projectQuery, [projectSlug])

      if (projectResult.rows.length === 0) {
        throw new Error(`Project not found: ${projectSlug}`)
      }

      const projectId = projectResult.rows[0].id

      const createPageQuery = `
        INSERT INTO pages (project_id, slug, gjs_html, gjs_css, gjs_components, gjs_styles, updated_at)
        VALUES ($1, $2, '', '', '[]', '[]', NOW())
        RETURNING id, project_id, slug, updated_at
      `
      const pageResult = await client.query<PageData>(createPageQuery, [projectId, pageSlug])

      if (pageResult.rows.length === 0) {
        return null
      }

      logger.info(`Page created successfully: ${pageSlug}`)
      return pageResult.rows[0]
    })
  } catch (error) {
    logger.error('Error creating page:', error)
    throw error
  }
}
