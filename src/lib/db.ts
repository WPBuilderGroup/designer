import { Pool, PoolClient } from 'pg'

// Global connection pool
let globalPool: Pool | null = null

// Database connection configuration
export function getPool(): Pool {
  if (!globalPool) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    globalPool = new Pool({
      connectionString,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })

    // Handle pool errors
    globalPool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })

    console.log('Database pool initialized successfully')
  }

  return globalPool
}

// Generic query function with proper error handling
export async function query<T = unknown>(text: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }> {
  const pool = getPool()
  const client = await pool.connect()
  
  try {
    const start = Date.now()
    const result = await client.query(text, params)
    const duration = Date.now() - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed:', { text, duration: `${duration}ms`, rows: result.rowCount })
    }
    
    return {
      rows: result.rows,
      rowCount: result.rowCount ?? 0
    }
  } catch (error) {
    console.error('Database query error:', error)
    console.error('Query:', text)
    console.error('Params:', params)
    throw error
  } finally {
    client.release()
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
    await client.query('ROLLBACK')
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
    console.error('Database health check failed:', error)
    return false
  }
}

// Close pool gracefully
export async function closePool(): Promise<void> {
  if (globalPool) {
    await globalPool.end()
    globalPool = null
    console.log('Database pool closed')
  }
}

// Types for our database schema
export interface PageData {
  id: string
  project_id: string
  slug: string
  gjs_html?: string | null
  gjs_css?: string | null
  gjs_components?: unknown
  gjs_styles?: unknown
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

// Helper functions for GrapesJS data management
export async function getPageData(projectSlug: string, pageSlug: string): Promise<PageData | null> {
  try {
    // First get project by slug
    const projectQuery = `
      SELECT id FROM projects WHERE slug = $1 LIMIT 1
    `
    const projectResult = await query<{ id: string }>(projectQuery, [projectSlug])
    
    if (projectResult.rows.length === 0) {
      console.warn(`Project not found: ${projectSlug}`)
      return null
    }
    
    const projectId = projectResult.rows[0].id
    
    // Get page data
    const pageQuery = `
      SELECT id, project_id, slug, gjs_html, gjs_css, gjs_components, gjs_styles, updated_at
      FROM pages 
      WHERE project_id = $1 AND slug = $2
    `
    const pageResult = await query<PageData>(pageQuery, [projectId, pageSlug])
    
    if (pageResult.rows.length === 0) {
      console.log(`Page not found: ${projectSlug}/${pageSlug}`)
      return null
    }
    
    return pageResult.rows[0]
  } catch (error) {
    console.error('Error getting page data:', error)
    throw error
  }
}

export async function upsertPageData(projectSlug: string, pageSlug: string, data: {
  'gjs-html'?: string
  'gjs-css'?: string
  'gjs-components'?: unknown
  'gjs-styles'?: unknown
}): Promise<boolean> {
  try {
    return await transaction(async (client) => {
      // First get project by slug
      const projectQuery = `
        SELECT id FROM projects WHERE slug = $1 LIMIT 1
      `
      const projectResult = await client.query(projectQuery, [projectSlug])
      
      if (projectResult.rows.length === 0) {
        console.warn(`Project not found: ${projectSlug}`)
        return false
      }
      
      const projectId = projectResult.rows[0].id
      
      // Upsert page data
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
        data['gjs-html'] || null,
        data['gjs-css'] || null,
        data['gjs-components'] ? JSON.stringify(data['gjs-components']) : null,
        data['gjs-styles'] ? JSON.stringify(data['gjs-styles']) : null
      ])
      
      console.log(`Page upserted successfully: ${projectSlug}/${pageSlug}`)
      return result.rows.length > 0
    })
  } catch (error) {
    console.error('Error upserting page data:', error)
    throw error
  }
}

export async function getProjectsByWorkspace(workspaceSlug: string): Promise<Array<Project & { page_count: number }>> {
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

    return result.rows.map(row => ({
      id: row.id,
      tenant_id: row.tenant_id,
      slug: row.slug,
      name: row.name,
      created_at: row.created_at,
      page_count: parseInt(row.page_count) || 0
    }))
  } catch (error) {
    console.error('Error getting projects by workspace:', error)
    throw error
  }
}

export async function createProject(workspaceSlug: string, projectSlug: string, projectName: string): Promise<Project | null> {
  try {
    return await transaction(async (client) => {
      // Get or create tenant
        const tenantQuery = `
          SELECT id FROM tenants WHERE slug = $1 LIMIT 1
        `
        const tenantResult = await client.query(tenantQuery, [workspaceSlug])
      
      let tenantId: string
      if (tenantResult.rows.length === 0) {
        const createTenantQuery = `
          INSERT INTO tenants (slug, name, created_at) 
          VALUES ($1, $2, NOW()) 
          RETURNING id
        `
        const newTenantResult = await client.query(createTenantQuery, [workspaceSlug, workspaceSlug])
        tenantId = newTenantResult.rows[0].id
        console.log(`Created new tenant: ${workspaceSlug}`)
      } else {
        tenantId = tenantResult.rows[0].id
      }

      // Create project
      const createProjectQuery = `
        INSERT INTO projects (tenant_id, slug, name, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, tenant_id, slug, name, created_at
      `
      const projectResult = await client.query(createProjectQuery, [tenantId, projectSlug, projectName])
      
      if (projectResult.rows.length === 0) {
        return null
      }

      console.log(`Project created successfully: ${projectSlug}`)
      return projectResult.rows[0]
    })
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export async function getPagesByProject(projectSlug: string): Promise<PageData[]> {
  try {
    // Get project by slug
    const projectQuery = `
      SELECT id FROM projects WHERE slug = $1 LIMIT 1
    `
    const projectResult = await query<{ id: string }>(projectQuery, [projectSlug])
    
    if (projectResult.rows.length === 0) {
      throw new Error(`Project not found: ${projectSlug}`)
    }

    const projectId = projectResult.rows[0].id

    // Get pages for this project
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
    console.error('Error getting pages by project:', error)
    throw error
  }
}

export async function createPage(projectSlug: string, pageSlug: string): Promise<PageData | null> {
  try {
    return await transaction(async (client) => {
      // Get project by slug
      const projectQuery = `
        SELECT id FROM projects WHERE slug = $1 LIMIT 1
      `
      const projectResult = await client.query(projectQuery, [projectSlug])
      
      if (projectResult.rows.length === 0) {
        throw new Error(`Project not found: ${projectSlug}`)
      }

      const projectId = projectResult.rows[0].id

      // Create page with empty content
      const createPageQuery = `
        INSERT INTO pages (project_id, slug, gjs_html, gjs_css, gjs_components, gjs_styles, updated_at)
        VALUES ($1, $2, '', '', '[]', '[]', NOW())
        RETURNING id, project_id, slug, updated_at
      `
      const pageResult = await client.query(createPageQuery, [projectId, pageSlug])

      if (pageResult.rows.length === 0) {
        return null
      }

      console.log(`Page created successfully: ${pageSlug}`)
      return pageResult.rows[0]
    })
  } catch (error) {
    console.error('Error creating page:', error)
    throw error
  }
}
