import { ChevronRight } from 'lucide-react'
import { NAV_SECTIONS } from './nav'
import { Avatar } from '@/components/profile/Avatar'
import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/format'
import type { DashboardData } from '@/types/dashboard'

interface SidebarContentProps {
    active: string
    data: DashboardData
    isProfile: boolean
    onProfile: () => void
    onSectionNavigate: (id: string) => void
    onNavigate?: () => void
}

/** Contenido compartido entre la barra lateral fija (escritorio) y el Sheet (móvil). */
export function SidebarContent({
    active,
    data,
    isProfile,
    onProfile,
    onSectionNavigate,
    onNavigate,
}: SidebarContentProps) {
    const { summary, currentUser } = data
    const hasCritical = summary.critical > 0

    return (
        <div className="flex h-full flex-col">
            <a
                href="#overview"
                onClick={onNavigate}
                aria-label="Vigía — ir al inicio"
                className="flex items-center gap-2.5 px-4 pb-5 pt-5"
            >
                <img src="/favicon.svg" alt="" aria-hidden="true" className="size-8 shrink-0" />
                <span className="leading-tight">
                    <span className="block font-display text-base font-semibold tracking-tight text-ink">
                        Vigía
                    </span>
                    <span className="block text-xs text-muted-foreground">observabilidad</span>
                </span>
            </a>

            <nav className="flex-1 space-y-1 px-3" aria-label="Secciones del dashboard">
                {NAV_SECTIONS.map((section) => {
                    const Icon = section.icon
                    const isActive = !isProfile && active === section.id
                    return (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={(event) => {
                                onNavigate?.()
                                // En la página de perfil la navegación de sección vuelve al dashboard.
                                if (isProfile) {
                                    event.preventDefault()
                                    onSectionNavigate(section.id)
                                }
                            }}
                            aria-current={isActive ? 'true' : undefined}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-signal-soft text-ink'
                                    : 'text-neutral hover:bg-paper-3 hover:text-ink',
                            )}
                        >
                            <Icon
                                className={cn(
                                    'size-4 shrink-0',
                                    isActive ? 'text-signal' : 'text-faint',
                                )}
                                aria-hidden="true"
                            />
                            <span className="whitespace-nowrap">{section.label}</span>
                        </a>
                    )
                })}
            </nav>

            {/* Usuario simulado que accede al panel */}
            <div className="border-t">
                <button
                    type="button"
                    onClick={onProfile}
                    aria-current={isProfile ? 'true' : undefined}
                    className={cn(
                        'flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors',
                        isProfile ? 'bg-signal-soft' : 'hover:bg-paper-3',
                    )}
                >
                    <Avatar name={currentUser.name} className="size-8 text-xs" />
                    <span className="min-w-0 flex-1 leading-tight">
                        <span className="block truncate text-sm font-medium text-ink">
                            {currentUser.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                            {currentUser.role}
                        </span>
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-faint" aria-hidden="true" />
                </button>

                <div className="border-t px-4 py-3 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                        <span
                            className={cn(
                                'size-1.5 rounded-full',
                                hasCritical ? 'bg-danger' : 'bg-success',
                            )}
                            aria-hidden="true"
                        />
                        <span>
                            {summary.totalServers} servidores · {summary.critical} crítico
                            {summary.critical === 1 ? '' : 's'}
                        </span>
                    </p>
                    <p className="num mt-1 text-faint">
                        últ. actualización {formatTime(data.updatedAt)}
                    </p>
                </div>
            </div>
        </div>
    )
}

interface SidebarProps {
    active: string
    data: DashboardData
    isProfile: boolean
    onProfile: () => void
    onSectionNavigate: (id: string) => void
}

/** Barra lateral fija, solo en escritorio. */
export function Sidebar({ active, data, isProfile, onProfile, onSectionNavigate }: SidebarProps) {
    return (
        <aside className="fixed inset-y-0 left-0 z-[var(--z-sticky)] hidden w-64 border-r bg-paper-2/70 lg:block">
            <SidebarContent
                active={active}
                data={data}
                isProfile={isProfile}
                onProfile={onProfile}
                onSectionNavigate={onSectionNavigate}
            />
        </aside>
    )
}
