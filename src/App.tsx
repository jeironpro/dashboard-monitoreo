import { useEffect, useRef, useState } from 'react'
import { Header } from '@/components/layout/Header'
import type { TimeRange } from '@/components/layout/time-range'
import { Footer } from '@/components/layout/Footer'
import { NAV_SECTIONS, SECTION_IDS } from '@/components/layout/nav'
import { Sidebar, SidebarContent } from '@/components/layout/Sidebar'
import { ProfilePage } from '@/components/profile/ProfilePage'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LatencyChart } from '@/components/dashboard/LatencyChart'
import { LogsPanel } from '@/components/dashboard/LogsPanel'
import { MetricsPanels } from '@/components/dashboard/MetricsPanels'
import { RecentAlerts } from '@/components/dashboard/RecentAlerts'
import { SectionHeading } from '@/components/dashboard/SectionHeading'
import { SecurityAlerts } from '@/components/dashboard/SecurityAlerts'
import { ServersPanel } from '@/components/dashboard/ServersPanel'
import { StatusSummary } from '@/components/dashboard/StatusSummary'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useReveal } from '@/hooks/useReveal'

type View = 'dashboard' | 'profile'

export default function App() {
    const { data, refresh } = useDashboardData()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [range, setRange] = useState<TimeRange>('24h')
    const [view, setView] = useState<View>('dashboard')
    const pendingSection = useRef<string | null>(null)

    const overview = NAV_SECTIONS[0]
    const isProfile = view === 'profile'
    const active = useActiveSection(SECTION_IDS, !isProfile)
    const revealRef = useReveal<HTMLDivElement>()

    const goToSection = (id: string) => {
        pendingSection.current = id
        setView('dashboard')
    }

    // Al volver del perfil con una sección pendiente, desplaza hasta ella.
    useEffect(() => {
        if (view === 'dashboard' && pendingSection.current) {
            const id = pendingSection.current
            pendingSection.current = null
            requestAnimationFrame(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
            })
        }
    }, [view])

    const openProfile = () => setView('profile')
    const closeProfile = () => setView('dashboard')

    return (
        <TooltipProvider delayDuration={800}>
            <div ref={revealRef} className="min-h-dvh">
                <Sidebar
                    active={active}
                    data={data}
                    isProfile={isProfile}
                    onProfile={openProfile}
                    onSectionNavigate={goToSection}
                />

                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent side="left" className="w-[280px] p-0">
                        <SheetTitle className="sr-only">Navegación</SheetTitle>
                        <SheetDescription className="sr-only">
                            Menú principal del dashboard
                        </SheetDescription>
                        <SidebarContent
                            active={active}
                            data={data}
                            isProfile={isProfile}
                            onProfile={openProfile}
                            onSectionNavigate={goToSection}
                            onNavigate={() => setMobileOpen(false)}
                        />
                    </SheetContent>
                </Sheet>

                <div className="lg:pl-64">
                    <Header
                        onMenuClick={() => setMobileOpen(true)}
                        updatedAt={data.updatedAt}
                        range={range}
                        onRangeChange={setRange}
                        onRefresh={refresh}
                        user={data.currentUser}
                        onProfile={openProfile}
                    />

                    <main className="mx-auto max-w-[1400px] px-4 pb-4 sm:px-6 lg:px-8">
                        {/* El dashboard permanece montado (oculto) para conservar el reveal de entrada. */}
                        <div className={isProfile ? 'hidden' : undefined}>
                            {/* Visión general */}
                            <section>
                                <SectionHeading
                                    id={overview.id}
                                    icon={overview.icon}
                                    title="Visión general"
                                    description="Resumen del estado de la infraestructura en tiempo real."
                                />
                                <StatusSummary data={data} />
                                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                                    <LatencyChart
                                        points={data.latencyHistory}
                                        range={range}
                                        className="lg:col-span-2"
                                    />
                                    <RecentAlerts data={data} />
                                </div>
                            </section>

                            <ServersPanel data={data} />
                            <MetricsPanels data={data} />
                            <LogsPanel data={data} />
                            <SecurityAlerts data={data} />
                        </div>

                        {isProfile && (
                            <ProfilePage
                                user={data.currentUser}
                                onBack={closeProfile}
                                // Cierre de sesión simulado: en la demo no navega a ningún lado.
                                onLogout={() => {}}
                            />
                        )}
                    </main>

                    <Footer />
                </div>
            </div>
        </TooltipProvider>
    )
}
