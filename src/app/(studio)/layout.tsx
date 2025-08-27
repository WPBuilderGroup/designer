import AppShell from '@/components/AppShell'
import type { ReactNode } from 'react'

export default function StudioLayout({
  children,
}: {
  children: ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
