'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Page {
  id: string
  slug: string
  updated_at: string
  has_content: boolean
}

interface Project {
  id: string
  slug: string
  name: string
  created_at: string
  page_count: number
}

export default function PagesPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentProject = searchParams.get('project') || 'default-project'
  const currentPage = searchParams.get('page') || 'home'
  
  const [pages, setPages] = useState<Page[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [newPageSlug, setNewPageSlug] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [showNewPageForm, setShowNewPageForm] = useState(false)
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [error, setError] = useState('')

  // Load projects on mount
  useEffect(() => {
    loadProjects()
  }, [])

  // Load pages when project changes
  useEffect(() => {
    if (currentProject) {
      loadPages()
    }
  }, [currentProject])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects?workspace=default')
      const data = await response.json()
      if (response.ok) {
        setProjects(data.projects)
      } else {
        setError(data.error || 'Failed to load projects')
      }
    } catch (err) {
      setError('Failed to load projects')
      console.error('Error loading projects:', err)
    }
  }

  const loadPages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pages?project=${currentProject}`)
      const data = await response.json()
      if (response.ok) {
        setPages(data.pages)
      } else {
        setError(data.error || 'Failed to load pages')
      }
    } catch (err) {
      setError('Failed to load pages')
      console.error('Error loading pages:', err)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async () => {
    if (!newProjectName.trim()) return

    try {
      const slug = newProjectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const response = await fetch('/api/projects?workspace=default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName.trim(),
          slug: slug
        })
      })

      const data = await response.json()
      if (response.ok) {
        setProjects(prev => [data.project, ...prev])
        setNewProjectName('')
        setShowNewProjectForm(false)
        setError('')
        // Switch to new project
        router.push(`/builder?project=${slug}&page=home`)
      } else {
        setError(data.error || 'Failed to create project')
      }
    } catch (err) {
      setError('Failed to create project')
      console.error('Error creating project:', err)
    }
  }

  const createPage = async () => {
    if (!newPageSlug.trim()) return

    try {
      const slug = newPageSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const response = await fetch(`/api/pages?project=${currentProject}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      })

      const data = await response.json()
      if (response.ok) {
        setPages(prev => [...prev, data.page])
        setNewPageSlug('')
        setShowNewPageForm(false)
        setError('')
        // Switch to new page
        router.push(`/builder?project=${currentProject}&page=${slug}`)
      } else {
        setError(data.error || 'Failed to create page')
      }
    } catch (err) {
      setError('Failed to create page')
      console.error('Error creating page:', err)
    }
  }

  const switchToPage = (pageSlug: string) => {
    router.push(`/builder?project=${currentProject}&page=${pageSlug}`)
  }

  const switchToProject = (projectSlug: string) => {
    router.push(`/builder?project=${projectSlug}&page=home`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Projects Section */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Projects</h3>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            + New
          </button>
        </div>

        {showNewProjectForm && (
          <div className="mb-3 p-2 bg-white border rounded">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded mb-2"
              onKeyPress={(e) => e.key === 'Enter' && createProject()}
            />
            <div className="flex gap-1">
              <button
                onClick={createProject}
                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewProjectForm(false)
                  setNewProjectName('')
                  setError('')
                }}
                className="text-xs bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="max-h-32 overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => switchToProject(project.slug)}
              className={`text-xs p-2 rounded cursor-pointer mb-1 ${
                project.slug === currentProject
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <div className="font-medium">{project.name}</div>
              <div className="text-gray-500">{project.page_count} pages</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pages Section */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Pages</h3>
          <button
            onClick={() => setShowNewPageForm(true)}
            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            + New Page
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
            {error}
          </div>
        )}

        {showNewPageForm && (
          <div className="mb-3 p-2 bg-white border rounded">
            <input
              type="text"
              placeholder="Page slug (e.g., about, contact)"
              value={newPageSlug}
              onChange={(e) => setNewPageSlug(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded mb-2"
              onKeyPress={(e) => e.key === 'Enter' && createPage()}
            />
            <div className="flex gap-1">
              <button
                onClick={createPage}
                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewPageForm(false)
                  setNewPageSlug('')
                  setError('')
                }}
                className="text-xs bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-xs text-gray-500 text-center py-4">Loading pages...</div>
        ) : (
          <div className="space-y-1">
            {pages.map((page) => (
              <div
                key={page.id}
                onClick={() => switchToPage(page.slug)}
                className={`text-xs p-2 rounded cursor-pointer flex items-center justify-between ${
                  page.slug === currentPage
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      page.has_content ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                    title={page.has_content ? 'Has content' : 'Empty page'}
                  />
                  <span className="font-medium">
                    {page.slug}
                    {page.slug === 'home' && <span className="text-gray-400 ml-1">(home)</span>}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {formatDate(page.updated_at)}
                </span>
              </div>
            ))}
            
            {pages.length === 0 && !loading && (
              <div className="text-xs text-gray-500 text-center py-4">
                No pages found. Create your first page!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
