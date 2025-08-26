
  // Filter dropdown items
  const statusFilterItems = [
    { label: 'All statuses', onClick: () => setStatusFilter('all') },
    { label: 'Published', onClick: () => setStatusFilter('published') },
    { label: 'Draft', onClick: () => setStatusFilter('draft') },
  ]

  const sortByItems = [
    { label: 'Updated (newest first)', onClick: () => setSortBy('updated-desc') },
    { label: 'Updated (oldest first)', onClick: () => setSortBy('updated-asc') },
    { label: 'Name (A-Z)', onClick: () => setSortBy('name-asc') },
  ]

  const getSortLabel = () => {
    switch (sortBy) {
      case 'updated-desc': return 'Updated (newest first)'
      case 'updated-asc': return 'Updated (oldest first)'
      case 'name-asc': return 'Name (A-Z)'
      default: return 'Updated (newest first)'
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600 mt-1">Manage your landing pages and websites</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left filters */}
          <div className="flex flex-col sm:flex-row gap-3">
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
          <div className="flex flex-col sm:flex-row gap-3">
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
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
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
                  <div className="flex items-center space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      title="Edit project"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete project"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Publish Button */}
                  {project.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(project)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Publish project"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
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

      {/* Create Project Modal - Placeholder for Prompt 9 */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Create project modal will be implemented in the next stage.
          </p>
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { listProjects, updateProject, deleteProject } from '../../../lib/store'
import type { Project, ProjectStatus } from '../../../lib/types'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Dropdown from '../../../components/ui/Dropdown'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'

const CURRENT_WORKSPACE_KEY = 'currentWS'

export default function ProjectsPage() {
  const router = useRouter()
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
    }
  }, [])

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
      const success = updateProject(project.id, { status: 'published' })
      if (success) {
        // Refresh projects list
        if (currentWorkspaceId) {
          const updatedProjects = listProjects({ workspaceId: currentWorkspaceId })
          setProjects(updatedProjects)
        }
      }
    } catch (error) {
      console.error('Failed to publish project:', error)
      alert('Failed to publish project')
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
