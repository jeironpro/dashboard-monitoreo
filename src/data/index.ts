// Cargador tipado del MOCK: re-ancla los timestamps a «ahora» para que el dashboard
// siempre parezca en vivo y calcula el resumen desde los servidores (fuente de verdad).

import mockData from './mock-data.json'
import type {
    ApiEndpoint,
    DashboardData,
    Database,
    ErrorLog,
    ExceptionGroup,
    LatencyPoint,
    Queue,
    SecurityAlert,
    Server,
    Summary,
    UserProfile,
} from '@/types/dashboard'

type RawServer = Omit<Server, 'lastIncident'> & { lastIncident: string }
type RawErrorLog = Omit<ErrorLog, 'timestamp'> & { timestamp: string }
type RawException = Omit<ExceptionGroup, 'lastSeen'> & { lastSeen: string }
type RawSecurityAlert = Omit<SecurityAlert, 'timestamp'> & { timestamp: string }
type RawUserProfile = Omit<UserProfile, 'lastLogin'> & { lastLogin: string }

interface RawMock {
    generatedAt: string
    systemName: string
    environment: string
    currentUser: RawUserProfile
    summary: Summary
    latencyHistory: LatencyPoint[]
    servers: RawServer[]
    errorLogs: RawErrorLog[]
    exceptions: RawException[]
    databases: Database[]
    apis: ApiEndpoint[]
    queues: Queue[]
    securityAlerts: RawSecurityAlert[]
}

const raw = mockData as unknown as RawMock

export function computeSummary(servers: Server[]): Summary {
    return servers.reduce<Summary>(
        (acc, server) => {
            acc.totalServers += 1
            if (server.status === 'operational') acc.operational += 1
            else if (server.status === 'degraded') acc.degraded += 1
            else if (server.status === 'critical') acc.critical += 1
            return acc
        },
        { totalServers: 0, operational: 0, degraded: 0, critical: 0 },
    )
}

export function loadMockData(now: number = Date.now()): DashboardData {
    // Desplaza todas las marcas temporales para anclar `generatedAt` al instante actual.
    const shift = now - Date.parse(raw.generatedAt)
    const epoch = (iso: string) => Date.parse(iso) + shift

    const servers = raw.servers.map((s) => ({ ...s, lastIncident: epoch(s.lastIncident) }))

    return {
        systemName: raw.systemName,
        environment: raw.environment,
        updatedAt: now,
        currentUser: { ...raw.currentUser, lastLogin: epoch(raw.currentUser.lastLogin) },
        summary: computeSummary(servers),
        latencyHistory: raw.latencyHistory,
        servers,
        errorLogs: raw.errorLogs.map((l) => ({ ...l, timestamp: epoch(l.timestamp) })),
        exceptions: raw.exceptions.map((e) => ({ ...e, lastSeen: epoch(e.lastSeen) })),
        databases: raw.databases,
        apis: raw.apis,
        queues: raw.queues,
        securityAlerts: raw.securityAlerts.map((a) => ({ ...a, timestamp: epoch(a.timestamp) })),
    }
}
