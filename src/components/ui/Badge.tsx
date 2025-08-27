import { HTMLAttributes } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { ProjectStatus } from '../../lib/types'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: ProjectStatus | 'default'
  children: ReactNode
}

const Badge = ({ className, variant = 'default', children, ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-yellow-100 text-yellow-800': variant === 'draft',
          'bg-green-100 text-green-800': variant === 'published',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
