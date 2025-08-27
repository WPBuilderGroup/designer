import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { cn } from '../../lib/utils'

export interface DropdownItem {
  label: string
  onClick: () => void
  icon?: ReactNode
  disabled?: boolean
  selected?: boolean
  type?: 'separator' | 'item'
}

export interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
}

const Dropdown = ({ trigger, items, align = 'right' }: DropdownProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button as={Fragment}>
          {trigger}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            {
              'origin-top-right right-0': align === 'right',
              'origin-top-left left-0': align === 'left',
            }
          )}
        >
          <div className="py-1">
            {items.map((item, index) => {
              // Handle separator lines
              if (item.type === 'separator' || item.label === '---') {
                return (
                  <div key={index} className="border-t border-gray-200 my-1" />
                )
              }

              return (
                <Menu.Item key={index} disabled={item.disabled}>
                  {({ active }) => (
                    <button
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={cn(
                        'group flex w-full items-center px-4 py-2 text-sm transition-colors',
                        {
                          'bg-gray-100 text-gray-900': active && !item.disabled,
                          'text-gray-700': !active && !item.disabled,
                          'text-gray-400 cursor-not-allowed': item.disabled,
                        }
                      )}
                    >
                      {item.icon && (
                        <span className="mr-3 flex-shrink-0">
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              )
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Dropdown
