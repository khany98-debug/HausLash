import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-[1em] w-[4.25em] shrink-0 items-center text-2xl leading-none text-foreground',
        className,
      )}
      role="img"
      aria-label="Hauslash"
    >
      <svg
        aria-hidden="true"
        className="block h-full w-full overflow-visible"
        fill="currentColor"
        viewBox="0 0 425 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="76"
          fontFamily="var(--font-playfair), 'Playfair Display', serif"
          fontSize="92"
          fontStyle="italic"
          fontWeight="400"
          letterSpacing="-4"
        >
          haus
        </text>
        <rect x="176" y="2" width="23.5" height="74" rx="1.5" />
        <text
          x="200"
          y="76"
          fontFamily="var(--font-inter), Inter, Arial, sans-serif"
          fontSize="78"
          fontWeight="900"
          letterSpacing="-6"
        >
          ash
        </text>
      </svg>
    </span>
  )
}
