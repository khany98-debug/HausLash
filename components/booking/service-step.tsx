import { Service, formatPence, formatDuration } from '@/lib/types'
import { Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ServiceStep({
  services,
  selectedId,
  onSelect,
}: {
  services: Service[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h2 className="text-lg md:text-xl font-medium text-foreground mb-2 md:mb-3">Choose your treatment</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        {services.map((service) => {
          const isSelected = service.id === selectedId
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={cn(
                'flex min-w-0 flex-col gap-3 overflow-hidden rounded-xl border p-4 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-5',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/60 bg-card hover:border-primary/40 hover:shadow-sm'
              )}
              aria-pressed={isSelected}
              tabIndex={0}
            >
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="min-w-0 text-base font-medium leading-snug text-foreground">{service.name}</h3>
                <div className="flex shrink-0 items-center gap-2">
                  {service.price_pence !== null && (
                    <span className="text-sm font-medium text-foreground">
                      {service.price_pence > 0 ? formatPence(service.price_pence) : 'Free'}
                    </span>
                  )}
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
              {service.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDuration(service.duration_minutes)}
                <span>
                  {service.deposit_pence > 0
                    ? `Non-refundable deposit: ${formatPence(service.deposit_pence)}`
                    : 'Free booking'}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
