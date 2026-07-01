import { Service, formatPence, formatDuration } from '@/lib/types'
import { Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isPatchTestService } from '@/lib/service-display'

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
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
        {services.map((service) => {
          const isSelected = service.id === selectedId
          const isPatchTest = isPatchTestService(service)
          const priceLabel =
            service.price_pence === null
              ? 'Enquire'
              : service.price_pence > 0
                ? formatPence(service.price_pence)
                : 'Free'
          const depositLabel =
            isPatchTest && service.deposit_pence > 0
              ? `Refundable attendance deposit: ${formatPence(service.deposit_pence)}`
              : service.deposit_pence > 0
                ? `Non-refundable deposit: ${formatPence(service.deposit_pence)}`
                : 'Free booking'

          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={cn(
                'group flex min-w-0 flex-col gap-4 overflow-hidden rounded-2xl border p-4 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary sm:p-5 lg:min-h-[284px]',
                isPatchTest && 'lg:col-span-2 lg:min-h-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/60 bg-card hover:border-primary/40 hover:shadow-sm'
              )}
              aria-pressed={isSelected}
              tabIndex={0}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex min-w-0 items-start justify-between gap-4">
                  <div className="min-w-0">
                    {isPatchTest && (
                      <p className="mb-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        First-time clients
                      </p>
                    )}
                    <h3 className="min-w-0 text-base font-medium leading-snug text-foreground">
                      {service.name}
                    </h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold text-foreground">
                      {priceLabel}
                    </span>
                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                {service.description && (
                  <p className={cn(
                    'text-sm leading-relaxed text-muted-foreground',
                    isPatchTest && 'lg:max-w-2xl'
                  )}>
                    {service.description}
                  </p>
                )}
              </div>
              <div
                className={cn(
                  'mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground',
                  isPatchTest && 'lg:mt-0 lg:min-w-64 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:py-2 lg:pl-8 lg:pt-0 lg:text-right'
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {formatDuration(service.duration_minutes)}
                </span>
                <span>{depositLabel}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
