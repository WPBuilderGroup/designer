import type { ReactNode } from 'react'

export default function BuilderLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="h-full w-full overflow-hidden">
      {children}
    </div>
  )
}
