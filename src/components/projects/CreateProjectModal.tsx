'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createProject } from '../../lib/store'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'

interface CreateProjectModalProps {
  open: boolean
  onClose: () => void
}

interface Template {
  id: string
  name: string
  thumbnail: string
  category: 'web' | 'email'
}

const templates: Template[] = [
  {
    id: 'wedding',
    name: 'Wedding',
    thumbnail: '/demo/Projects-detail.jpg',
    category: 'web'
  },
  {
    id: 'lumberton',
    name: 'Lumberton',
    thumbnail: '/demo/Projects-Create.jpg',
    category: 'web'
  },
  {
    id: 'ipb',
    name: 'IPB',
    thumbnail: '/demo/Projects-filter.jpg',
    category: 'web'
  },
  {
    id: 'music',
    name: 'Music',
    thumbnail: '/demo/Projects.jpg',
    category: 'web'
  }
]

const CreateProjectModal = ({ open, onClose }: CreateProjectModalProps) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'web' | 'email'>('web')
  const [activeSection, setActiveSection] = useState<'prompt' | 'template'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [projectName, setProjectName] = useState('')
  const [projectSlug, setProjectSlug] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Auto-generate slug from name
  useEffect(() => {
    if (projectName) {
      const slug = projectName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
      setProjectSlug(slug)
    } else {
      setProjectSlug('')
    }
  }, [projectName])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedTemplate(null)
      setProjectName('')
      setProjectSlug('')
      setActiveTab('web')
      setActiveSection('template')
    }
  }, [open])

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    if (!projectName) {
      setProjectName(template.name)
    }
  }

  const handleCreateProject = async () => {
    if (!selectedTemplate || !projectName.trim() || !projectSlug.trim()) return

    const currentWorkspaceId = localStorage.getItem('currentWS')
    if (!currentWorkspaceId) {
      alert('No workspace selected')
      return
    }

    setIsCreating(true)
    try {
      const newProject = createProject({
        workspaceId: currentWorkspaceId,
        name: projectName.trim(),
        slug: projectSlug.trim(),
        status: 'draft',
        thumb: selectedTemplate.thumbnail
      })

      onClose()
      router.refresh()
    } catch (error) {
      console.error('Failed to create project:', error)
      alert('Failed to create project')
    } finally {
      setIsCreating(false)
    }
  }

  const filteredTemplates = templates.filter(template => template.category === activeTab)

  return (
    <Modal open={open} onClose={onClose} title="Create New Project">
      <div className="w-full max-w-4xl">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('web')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'web'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Web
            </button>
            <button
              disabled
              className="py-2 px-1 border-b-2 border-transparent text-gray-400 cursor-not-allowed font-medium text-sm"
            >
              Email
            </button>
          </nav>
        </div>

        {/* Section Toggle (Hidden for now) */}
        <div className="hidden mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveSection('prompt')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                activeSection === 'prompt'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Prompt
            </button>
            <button
              onClick={() => setActiveSection('template')}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                activeSection === 'template'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Template
            </button>
          </div>
        </div>

        {/* Template Grid */}
        {activeSection === 'template' && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Choose a Template</h3>
            <div className="grid grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  {/* Template Image */}
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Template Info */}
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant={selectedTemplate?.id === template.id ? 'default' : 'outline'}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTemplateSelect(template)
                        }}
                        className="w-full"
                      >
                        {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Details Form */}
        {selectedTemplate && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900">Project Details</h3>

            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <Input
                id="project-name"
                type="text"
                placeholder="Enter project name..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isCreating}
                required
              />
            </div>

            <div>
              <label htmlFor="project-slug" className="block text-sm font-medium text-gray-700 mb-2">
                Project Slug
              </label>
              <Input
                id="project-slug"
                type="text"
                placeholder="project-slug"
                value={projectSlug}
                onChange={(e) => setProjectSlug(e.target.value)}
                disabled={isCreating}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                This will be used in the URL for your project
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={!selectedTemplate || !projectName.trim() || !projectSlug.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateProjectModal
