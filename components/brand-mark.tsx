import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline text-2xl leading-none tracking-[-0.08em] text-foreground',
        className,
      )}
      aria-label="Hauslash"
    >
      <span className="font-serif italic font-normal">haus</span>
      <span className="font-sans font-bold not-italic">lash</span>
    </span>
  )
}
