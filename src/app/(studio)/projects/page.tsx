'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { listProjects, updateProject, deleteProject } from '../../../lib/store'
import type { Project, ProjectStatus } from '../../../lib/types'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Dropdown from '../../../components/ui/Dropdown'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import CreateProjectModal from '../../../components/projects/CreateProjectModal'

const CURRENT_WORKSPACE_KEY = 'currentWS'

export default function ProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null)

  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all')
  const [sortBy, setSortBy] = useState<'updated-desc' | 'updated-asc' | 'name-asc'>('updated-desc')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Load current workspace and projects
  useEffect(() => {
    const workspaceId = localStorage.getItem(CURRENT_WORKSPACE_KEY)
    if (workspaceId) {
      setCurrentWorkspaceId(workspaceId)
      const allProjects = listProjects({ workspaceId })
      setProjects(allProjects)
    } else {
      // No workspace selected - clear projects
      setCurrentWorkspaceId(null)
      setProjects([])
    }
  }, [])

  // Initialize state from URL params
  useEffect(() => {
    const statusParam = searchParams.get('status')
    if (statusParam && (statusParam === 'published' || statusParam === 'draft')) {
      setStatusFilter(statusParam as ProjectStatus)
    } else {
      setStatusFilter('all')
    }
  }, [searchParams])

  // Update URL when filter changes
  const updateStatusFilter = (status: 'all' | ProjectStatus) => {
    setStatusFilter(status)

    const params = new URLSearchParams(searchParams.toString())
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }

    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/projects${newUrl}`, { scroll: false })
  }

  // Calculate published count
  const publishedCount = projects.filter(project => project.status === 'published').length

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...projects]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.slug.toLowerCase().includes(query)
      )
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'updated-desc':
          return b.updatedAt - a.updatedAt
        case 'updated-asc':
          return a.updatedAt - b.updatedAt
        case 'name-asc':
          return a.name.localeCompare(b.name)
        default:
          return b.updatedAt - a.updatedAt
      }
    })

    setFilteredProjects(filtered)
  }, [projects, statusFilter, searchQuery, sortBy])

  // Handle project actions
  const handleEdit = (project: Project) => {
    router.push(`/builder?project=${project.slug}&page=home`)
  }

  const handlePublish = async (project: Project) => {
    try {
      // Toggle between draft and published
      const newStatus = project.status === 'draft' ? 'published' : 'draft'
      const success = updateProject(project.id, { status: newStatus })
      if (success) {
        // Refresh projects list
        if (currentWorkspaceId) {
          const updatedProjects = listProjects({ workspaceId: currentWorkspaceId })
          setProjects(updatedProjects)
        }
      }
    } catch (error) {
      console.error('Failed to update project status:', error)
      alert('Failed to update project status')
    }
  }

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return

    setIsDeleting(true)
    try {
      const success = deleteProject(projectToDelete.id)
      if (success) {
        // Refresh projects list
        if (currentWorkspaceId) {
          const updatedProjects = listProjects({ workspaceId: currentWorkspaceId })
          setProjects(updatedProjects)
        }
        setShowDeleteConfirm(false)
        setProjectToDelete(null)
      } else {
        alert('Failed to delete project')
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle successful project creation
  const handleProjectCreated = () => {
    // Refresh projects list after creating a new project
    if (currentWorkspaceId) {
      const updatedProjects = listProjects({ workspaceId: currentWorkspaceId })
      setProjects(updatedProjects)
    }
  }

  // Helper functions
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  // Filter dropdown items
  const statusFilterItems = [
    { label: 'All statuses', onClick: () => updateStatusFilter('all') },
    { label: 'Published', onClick: () => updateStatusFilter('published') },
    { label: 'Draft', onClick: () => updateStatusFilter('draft') },
  ]

  const sortByItems = [
    { label: 'Updated (newest first)', onClick: () => setSortBy('updated-desc') },
    { label: 'Updated (oldest first)', onClick: () => setSortBy('updated-asc') },
    { label: 'Name (A-Z)', onClick: () => setSortBy('name-asc') },
  ]

  const getSortLabel = () => {
    switch (sortBy) {
      case 'updated-desc': return 'Updated'
      case 'updated-asc': return 'Updated (oldest first)'
      case 'name-asc': return 'Name (A-Z)'
      default: return 'Updated'
    }
  }

  const getStatusLabel = () => {
    switch (statusFilter) {
      case 'all': return 'All statuses'
      case 'published': return 'Published'
      case 'draft': return 'Draft'
      default: return 'All statuses'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Show workspace selection prompt if no workspace is selected */}
      {!currentWorkspaceId ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Workspace Selected</h2>
            <p className="text-gray-600 mb-6">You need to select a workspace to view and manage your projects. Please choose a workspace from the top navigation or create a new one.</p>
            <Button
              onClick={() => router.push('/workspaces')}
              className="inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Go to Workspaces
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your landing pages and websites</p>
          </div>

          {/* Filters Bar */}
          <div className="card mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left filters */}
              <div className="toolbar">
                {/* All projects dropdown - placeholder */}
                <Dropdown
                  trigger={
                    <Button variant="outline" size="sm">
                      <span>All projects</span>
                      <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  }
                  items={[
                    { label: 'All projects', onClick: () => {} },
                  ]}
                  align="left"
                />

                {/* Status filter */}
                <div className="toolbar">
                  <Dropdown
                    trigger={
                      <Button variant="outline" size="sm">
                        <span>{getStatusLabel()}</span>
                        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Button>
                    }
                    items={statusFilterItems}
                    align="left"
                  />

                  {/* Published count badge */}
                  {publishedCount > 0 && (
                    <Badge variant="published" className="text-xs">
                      {publishedCount} published
                    </Badge>
                  )}
                </div>

                {/* Sort by */}
                <Dropdown
                  trigger={
                    <Button variant="outline" size="sm">
                      <span>Sort by: {getSortLabel()}</span>
                      <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  }
                  items={sortByItems}
                  align="left"
                />
              </div>

              {/* Right side - Search and Create */}
              <div className="toolbar">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* Create Project Button */}
                <Button onClick={() => setShowCreateModal(true)}>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create new project
                </Button>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="card overflow-hidden hover:shadow-md transition-shadow !p-0"
                >
                  {/* Project Thumbnail */}
                  <div className="aspect-video bg-gray-100 relative">
                    {project.thumb ? (
                      <img
                        src={project.thumb}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant={project.status}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Updated {formatTimeAgo(project.updatedAt)}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="toolbar">
                        {/* Edit Button - Pencil Icon */}
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title={`Edit ${project.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>

                        {/* Delete Button - Trash Icon */}
                        <button
                          onClick={() => handleDeleteClick(project)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title={`Delete ${project.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Publish/Unpublish Button - Globe Icon */}
                      <button
                        onClick={() => handlePublish(project)}
                        className={`p-1.5 rounded transition-colors ${
                          project.status === 'published'
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title={project.status === 'published' ? `Unpublish ${project.name}` : `Publish ${project.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `No projects match "${searchQuery}". Try a different search term.`
                  : 'Create your first project to get started building landing pages.'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowCreateModal(true)}>
                  Create new project
                </Button>
              )}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setProjectToDelete(null)
        }}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{projectToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false)
                setProjectToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          handleProjectCreated()
        }}
      />
    </div>
  )
}
