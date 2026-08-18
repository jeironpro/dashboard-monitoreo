import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  id: string
  icon: LucideIcon
  title: string
  description: string
  actions?: ReactNode
}

export function SectionHeading({ id, icon: Icon, title, description, actions }: SectionHeadingProps) {
  return (
    <header
      id={id}
      className={cn(
        'section-anchor flex flex-col gap-4 pt-10 sm:flex-row sm:items-end sm:justify-between',
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-signal-soft text-signal">
            <Icon className="size-4" aria-hidden="true" />
          </span>
          <h2 className="min-w-0 font-display text-2xl font-semibold tracking-tight [overflow-wrap:anywhere]">
            {title}
          </h2>
        </div>
        <p className="mt-1.5 max-w-[65ch] text-sm text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  )
}
