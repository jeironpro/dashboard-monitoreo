import { ArrowLeft, Clock, Globe2, LogOut, MapPin, ShieldCheck } from 'lucide-react'
import { Avatar } from './Avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/format'
import type { UserProfile } from '@/types/dashboard'

interface ProfilePageProps {
  user: UserProfile
  onBack: () => void
  onLogout: () => void
}

/** Página dedicada al perfil del usuario simulado que accede al panel. */
export function ProfilePage({ user, onBack, onLogout }: ProfilePageProps) {
  return (
    <div className="pt-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver al dashboard
      </Button>

      <div className="mt-6 space-y-6">
        {/* Identidad */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <Avatar name={user.name} className="size-16 text-xl" />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
                {user.name}
              </h1>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              <p className="text-sm text-muted-foreground">{user.department}</p>
            </div>
            <Button variant="outline" onClick={onLogout} className="shrink-0">
              <LogOut className="size-4" aria-hidden="true" />
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Cuenta */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la cuenta</CardTitle>
              <CardDescription>Datos del usuario que accede al panel</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-xs text-faint">Correo</dt>
                  <dd className="num mt-0.5 text-ink">{user.email}</dd>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs text-faint">
                      <MapPin className="size-3.5" aria-hidden="true" />
                      Ubicación
                    </dt>
                    <dd className="mt-0.5 text-ink">{user.location}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs text-faint">
                      <Globe2 className="size-3.5" aria-hidden="true" />
                      Zona horaria
                    </dt>
                    <dd className="mt-0.5 text-ink">{user.timezone}</dd>
                  </div>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs text-faint">
                    <Clock className="size-3.5" aria-hidden="true" />
                    Último acceso
                  </dt>
                  <dd className="mt-0.5 text-ink">{formatDateTime(user.lastLogin)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Permisos */}
          <Card>
            <CardHeader>
              <CardTitle>Permisos</CardTitle>
              <CardDescription>Ámbitos asignados al perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {user.permissions.map((permission) => (
                  <li key={permission} className="flex items-center gap-2 text-sm text-ink">
                    <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden="true" />
                    <span className="num">{permission}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
