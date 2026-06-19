import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-baseline whitespace-nowrap text-2xl leading-none text-foreground',
        className,
      )}
      aria-label="Hauslash"
    >
      <span className="font-serif italic font-normal tracking-[-0.025em]">haus</span>
      <span className="ml-[0.16em] font-sans font-bold not-italic tracking-[-0.025em]">lash</span>
    </span>
  )
}
