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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
        {services.map((service) => {
          const isSelected = service.id === selectedId
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={cn(
                'flex flex-col gap-2 rounded-xl border p-5 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/60 bg-card hover:border-primary/40 hover:shadow-sm'
              )}
              aria-pressed={isSelected}
              tabIndex={0}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-foreground">{service.name}</h3>
                <div className="flex items-center gap-2">
                  {service.price_pence && (
                    <span className="text-sm font-medium text-foreground">
                      {formatPence(service.price_pence)}
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
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDuration(service.duration_minutes)}
                <span className="ml-2">Deposit: {formatPence(service.deposit_pence)}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
