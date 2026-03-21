import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export function StepIndicator({
  steps,
  current,
}: {
  steps: string[]
  current: number
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors',
                i < current
                  ? 'border-primary bg-primary text-primary-foreground'
                  : i === current
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground'
              )}
            >
              {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                'hidden text-sm sm:inline',
                i <= current ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'h-px w-6 sm:w-10',
                i < current ? 'bg-primary' : 'bg-border'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
