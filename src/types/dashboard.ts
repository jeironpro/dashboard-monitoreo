// Modelo de dominio del dashboard (timestamps en epoch ms tras el anclaje del cargador).

export type ServerStatus = 'operational' | 'degraded' | 'critical' | 'maintenance'

export type LogLevel = 'critical' | 'error' | 'warning' | 'exception'

export type LogStatus = 'new' | 'acknowledged' | 'resolved'

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'

export type AlertStatus = 'open' | 'investigating' | 'resolved'

export interface Server {
    id: string
    name: string
    hostname: string
    region: string
    role: string
    status: ServerStatus
    uptimePct: number
    latencyMs: number
    cpuPct: number
    memoryPct: number
    diskPct: number
    sparkline: number[]
    lastIncident: number
}

export interface LatencyPoint {
    t: string
    avg: number
    p95: number
}

export interface ErrorLog {
    id: string
    timestamp: number
    level: LogLevel
    service: string
    message: string
    occurrences: number
    source: string
    status: LogStatus
}

export interface ExceptionGroup {
    type: string
    message: string
    file: string
    count: number
    lastSeen: number
}

export interface Database {
    id: string
    name: string
    engine: string
    status: ServerStatus
    connections: number
    connectionsLimit: number
    queryLatencyMs: number
    slowQueries: number
    replicationLagSec: number
    sizeGb: number
}

export interface ApiEndpoint {
    id: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    path: string
    status: ServerStatus
    latencyMs: number
    requestsPerMin: number
    errorRatePct: number
    availabilityPct: number
}

export interface Queue {
    id: string
    name: string
    status: ServerStatus
    active: number
    waiting: number
    failed: number
    throughputPerMin: number
    consumers: number
}

export interface SecurityAlert {
    id: string
    timestamp: number
    severity: AlertSeverity
    type: string
    source: string
    message: string
    status: AlertStatus
}

export interface UserProfile {
    id: string
    name: string
    email: string
    role: string
    department: string
    location: string
    timezone: string
    lastLogin: number
    permissions: string[]
}

export interface Summary {
    totalServers: number
    operational: number
    degraded: number
    critical: number
}

export interface DashboardData {
    systemName: string
    environment: string
    updatedAt: number
    currentUser: UserProfile
    summary: Summary
    latencyHistory: LatencyPoint[]
    servers: Server[]
    errorLogs: ErrorLog[]
    exceptions: ExceptionGroup[]
    databases: Database[]
    apis: ApiEndpoint[]
    queues: Queue[]
    securityAlerts: SecurityAlert[]
}
