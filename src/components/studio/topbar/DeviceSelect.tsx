'use client'

import { useState, useRef, useEffect } from 'react'
import { Monitor, Tablet, Smartphone, ChevronDown } from 'lucide-react'

type DeviceType = 'Desktop' | 'Tablet' | 'Mobile'

export default function DeviceSelect() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('Desktop')
  const [isDeviceDropdownOpen, setIsDeviceDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const devices: { name: DeviceType; icon: typeof Monitor }[] = [
    { name: 'Desktop', icon: Monitor },
    { name: 'Tablet', icon: Tablet },
    { name: 'Mobile', icon: Smartphone },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDeviceDropdownOpen(false)
      }
    }

    if (isDeviceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchstart', handleClickOutside)
      }
    }
  }, [isDeviceDropdownOpen])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsDeviceDropdownOpen(false)
      buttonRef.current?.focus()
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsDeviceDropdownOpen(!isDeviceDropdownOpen)
    } else if (event.key === 'ArrowDown' && !isDeviceDropdownOpen) {
      event.preventDefault()
      setIsDeviceDropdownOpen(true)
    }
  }

  const getDeviceIcon = (deviceName: DeviceType) => {
    const device = devices.find(d => d.name === deviceName)
    return device ? device.icon : Monitor
  }

  const DeviceIcon = getDeviceIcon(selectedDevice)

  const handleDeviceSelect = (deviceName: DeviceType) => {
    setSelectedDevice(deviceName)
    setIsDeviceDropdownOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsDeviceDropdownOpen(!isDeviceDropdownOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center space-x-2 rounded-md px-2.5 py-1.5 text-sm bg-muted hover:bg-muted/80 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isDeviceDropdownOpen}
        aria-haspopup="listbox"
        aria-label={`Current device: ${selectedDevice}. Click to change device`}
        id="device-select-button"
      >
        <DeviceIcon size={16} aria-hidden="true" />
        <span className="hidden sm:inline">{selectedDevice}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform ${isDeviceDropdownOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isDeviceDropdownOpen && (
        <div 
          className="absolute top-full mt-1 left-0 right-0 min-w-[120px] bg-popover border border-border rounded-md shadow-lg z-50"
          role="listbox"
          aria-labelledby="device-select-button"
        >
          {devices.map((device) => (
            <button
              key={device.name}
              onClick={() => handleDeviceSelect(device.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleDeviceSelect(device.name)
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  const nextButton = e.currentTarget.nextElementSibling as HTMLButtonElement
                  nextButton?.focus()
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  const prevButton = e.currentTarget.previousElementSibling as HTMLButtonElement
                  prevButton?.focus()
                } else if (e.key === 'Escape') {
                  setIsDeviceDropdownOpen(false)
                  buttonRef.current?.focus()
                }
              }}
              className="w-full flex items-center space-x-2 rounded-md px-2.5 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-accent first:rounded-t-md last:rounded-b-md"
              role="option"
              aria-selected={selectedDevice === device.name}
              tabIndex={0}
            >
              <device.icon size={16} aria-hidden="true" />
              <span>{device.name}</span>
              {selectedDevice === device.name && (
                <span className="sr-only">Currently selected</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
