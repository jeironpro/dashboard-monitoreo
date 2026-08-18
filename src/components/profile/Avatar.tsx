import { cn } from '@/lib/utils'

/** Iniciales (máx. 2) a partir del nombre completo, p. ej. «Laura Méndez» → «LM». */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

interface AvatarProps {
  name: string
  className?: string
}

/** Avatar con iniciales sobre el acento cobalto (sin imagen, coherente con la demo). */
export function Avatar({ name, className }: AvatarProps) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-signal font-medium text-signal-ink',
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}
