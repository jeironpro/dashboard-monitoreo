import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar } from '@/components/profile/Avatar'
import type { UserProfile } from '@/types/dashboard'

interface UserMenuProps {
  user: UserProfile
  onProfile: () => void
}

/** Menú de usuario del header: muestra quién accede (demo) con acceso al perfil y a cerrar sesión. */
export function UserMenu({ user, onProfile }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menú de usuario"
          className="flex h-9 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-2 text-left transition-colors hover:bg-paper-3"
        >
          <Avatar name={user.name} className="size-7 text-xs" />
          <span className="hidden min-w-0 flex-col leading-tight md:flex">
            <span className="max-w-[10rem] truncate text-sm font-medium text-ink">{user.name}</span>
            <span className="max-w-[10rem] truncate text-xs text-faint">{user.role}</span>
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium text-ink">{user.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onProfile}>
          <UserRound className="size-4" aria-hidden="true" />
          Ver perfil
        </DropdownMenuItem>
        {/* Cierre de sesión simulado: en la demo no navega a ningún lado. */}
        <DropdownMenuItem onSelect={() => {}} className="text-danger focus:text-danger">
          <LogOut className="size-4" aria-hidden="true" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
