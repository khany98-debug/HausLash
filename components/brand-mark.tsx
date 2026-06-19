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
      <span className="font-serif italic font-normal tracking-[-0.035em]">haus</span>
      <span className="ml-[0.24em] font-sans font-black not-italic tracking-[-0.055em]">lash</span>
    </span>
  )
}
