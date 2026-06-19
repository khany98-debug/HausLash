import { cn } from '@/lib/utils'

const LOGO_MASK = '/images/brand/hauslash-logo-mask.png'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-[1em] w-[3.86em] shrink-0 items-center text-2xl leading-none text-foreground',
        className,
      )}
      role="img"
      aria-label="Hauslash"
    >
      <span
        aria-hidden="true"
        className="block h-full w-full bg-current"
        style={{
          WebkitMask: `url(${LOGO_MASK}) center / contain no-repeat`,
          mask: `url(${LOGO_MASK}) center / contain no-repeat`,
        }}
      />
    </span>
  )
}
