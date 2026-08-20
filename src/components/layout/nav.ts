import {
    Activity,
    LayoutDashboard,
    ScrollText,
    Server,
    ShieldAlert,
    type LucideIcon,
} from 'lucide-react'

export interface NavSection {
    id: string
    label: string
    description: string
    icon: LucideIcon
}

export const NAV_SECTIONS: NavSection[] = [
    {
        id: 'overview',
        label: 'Visión general',
        description: 'Estado global del sistema en tiempo real',
        icon: LayoutDashboard,
    },
    {
        id: 'servers',
        label: 'Servidores',
        description: 'Estado, uptime y latencia de cada nodo',
        icon: Server,
    },
    {
        id: 'metrics',
        label: 'Métricas de uso',
        description: 'Bases de datos, APIs y colas de trabajo',
        icon: Activity,
    },
    {
        id: 'logs',
        label: 'Logs y errores',
        description: 'Errores, excepciones y trazas',
        icon: ScrollText,
    },
    {
        id: 'security',
        label: 'Seguridad',
        description: 'Alertas y fallos de seguridad',
        icon: ShieldAlert,
    },
]

export const SECTION_IDS = NAV_SECTIONS.map((s) => s.id)
