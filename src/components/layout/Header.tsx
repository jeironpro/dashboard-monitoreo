import { useState } from 'react'
import { CalendarClock, Check, ChevronDown, Menu, RefreshCw } from 'lucide-react'
import { TIME_RANGE_LABELS, type TimeRange } from './time-range'
import { UserMenu } from './UserMenu'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/format'
import type { UserProfile } from '@/types/dashboard'

interface HeaderProps {
    onMenuClick: () => void
    updatedAt: number
    range: TimeRange
    onRangeChange: (range: TimeRange) => void
    onRefresh: () => void
    user: UserProfile
    onProfile: () => void
}

export function Header({
    onMenuClick,
    updatedAt,
    range,
    onRangeChange,
    onRefresh,
    user,
    onProfile,
}: HeaderProps) {
    const [refreshing, setRefreshing] = useState(false)

    const handleRefresh = () => {
        setRefreshing(true)
        onRefresh()
        window.setTimeout(() => setRefreshing(false), 600)
    }

    return (
        <header
            data-reveal
            className="sticky top-0 z-[var(--z-sticky-nav)] flex h-14 items-center gap-2 border-b bg-paper/85 px-4 backdrop-blur-sm sm:px-6 lg:px-8"
        >
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onMenuClick}
                aria-label="Abrir menú de navegación"
            >
                <Menu className="size-5" aria-hidden="true" />
            </Button>

            <div className="flex items-center gap-2">
                <span className="live-dot" aria-hidden="true" />
                <span className="num text-xs font-medium uppercase tracking-[0.08em] text-neutral">
                    En vivo
                </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <span className="num hidden text-xs text-faint md:inline-block">
                    actualizado {formatTime(updatedAt)}
                </span>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <CalendarClock className="size-4" aria-hidden="true" />
                            <span className="hidden sm:inline">{TIME_RANGE_LABELS[range]}</span>
                            <span className="num sm:hidden">{range}</span>
                            <ChevronDown className="size-3.5 text-faint" aria-hidden="true" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {(Object.keys(TIME_RANGE_LABELS) as TimeRange[]).map((r) => (
                            <DropdownMenuItem
                                key={r}
                                onClick={() => onRangeChange(r)}
                                className="justify-between gap-6"
                            >
                                {TIME_RANGE_LABELS[r]}
                                {r === range && (
                                    <Check className="size-4 text-signal" aria-hidden="true" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                            aria-label="Refrescar datos"
                        >
                            <RefreshCw
                                className={cn('size-4', refreshing && 'animate-spin')}
                                aria-hidden="true"
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refrescar datos</TooltipContent>
                </Tooltip>

                <UserMenu user={user} onProfile={onProfile} />
            </div>
        </header>
    )
}
