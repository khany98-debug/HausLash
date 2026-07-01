import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-foreground/10 bg-card/75 p-5 shadow-[0_24px_80px_-55px_rgba(45,38,31,0.55)] backdrop-blur sm:p-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 font-serif text-3xl leading-tight tracking-[-0.03em] text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function AdminStatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'neutral',
}: {
  label: string
  value: ReactNode
  detail?: string
  icon?: LucideIcon
  tone?: 'neutral' | 'success' | 'warning' | 'danger'
}) {
  const tones = {
    neutral: 'bg-primary/10 text-foreground',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-card/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
          {detail && <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>}
        </div>
        {Icon && (
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', tones[tone])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  )
}

export function AdminEmptyState({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
}) {
  return (
    <div className="rounded-3xl border border-dashed border-foreground/15 bg-card/55 p-8 text-center">
      {Icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function AdminLoadingState({ label = 'Loading admin data...' }: { label?: string }) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-3xl border border-foreground/10 bg-card/60">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </div>
    </div>
  )
}
