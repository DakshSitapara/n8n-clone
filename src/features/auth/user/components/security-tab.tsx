'use client'

import { useState } from 'react'
import {
    MonitorIcon,
    SmartphoneIcon,
    TabletIcon,
    GlobeIcon,
    ShieldIcon,
    LogOutIcon,
    WifiIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserData } from '../hooks/use-userData'
import { timeAgo, parseUserAgent } from '../lib/helpers'
import { toast } from 'sonner'

function DeviceIcon({ type }: { type: 'desktop' | 'mobile' | 'tablet' }) {
    const cls = 'h-4 w-4'
    if (type === 'mobile') return <SmartphoneIcon className={cls} />
    if (type === 'tablet') return <TabletIcon className={cls} />
    return <MonitorIcon className={cls} />
}

function SecuritySkeleton() {
    return (
        <div className="animate-pulse space-y-3 px-4 py-4 sm:px-5">
            <div className="border-border bg-muted/30 flex items-center gap-3 rounded-xl border p-3">
                <div className="bg-muted h-9 w-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                    <div className="bg-muted h-3.5 w-28 rounded" />
                    <div className="bg-muted h-3 w-36 rounded" />
                </div>
            </div>
            {[...Array(2)].map((_, i) => (
                <div key={i} className="border-border flex items-start gap-3 rounded-xl border p-3">
                    <div className="bg-muted h-9 w-9 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <div className="bg-muted h-3.5 w-40 rounded" />
                        <div className="bg-muted h-3 w-24 rounded" />
                        <div className="bg-muted h-3 w-28 rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function SecurityTab() {
    const { sessions, isLoadingSessions, revokeSession, isRevoking, currentSessionToken } =
        useUserData()
    const [revokingId, setRevokingId] = useState<string | null>(null)

    const handleRevoke = async (sessionId: string) => {
        setRevokingId(sessionId)
        try {
            await revokeSession({ sessionId })
            toast.success('Session revoked')
        } catch {
            toast.error('Failed to revoke session')
        } finally {
            setRevokingId(null)
        }
    }

    if (isLoadingSessions) return <SecuritySkeleton />

    const now = new Date()
    const activeSessions = sessions
        .filter((s) => new Date(s.expiresAt) > now)
        .sort((a, b) => {
            if (a.token === currentSessionToken) return -1
            if (b.token === currentSessionToken) return 1
            return 0
        })
    const expiredCount = sessions.length - activeSessions.length

    return (
        <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
            <div className="bg-accent flex items-center gap-3 rounded-xl border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
                    <ShieldIcon className="h-4 w-4 text-amber-900" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium">
                        {activeSessions.length} active session
                        {activeSessions.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-muted-foreground text-xs">Across all your devices</p>
                </div>
            </div>

            <p className="text-muted-foreground mt-1 text-[10px] font-semibold tracking-widest uppercase">
                Devices & sessions
            </p>

            {activeSessions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="bg-muted mb-3 flex h-10 w-10 items-center justify-center rounded-full">
                        <MonitorIcon className="text-muted-foreground h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium">No active sessions</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                        You&apos;ll see active devices here
                    </p>
                </div>
            )}

            <div className="space-y-2">
                {activeSessions.map((session) => {
                    const { device, browser, os, icon } = parseUserAgent(session.userAgent)
                    const isCurrent = session.token === currentSessionToken
                    const isBeingRevoked = revokingId === session.id

                    return (
                        <div
                            key={session.id}
                            className={cn(
                                'flex items-start gap-3 rounded-xl border p-3 transition-all duration-150',
                                isCurrent ? 'bg-accent' : 'border-border bg-card hover:bg-muted/30'
                            )}
                        >
                            <div
                                className={cn(
                                    'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                                    isCurrent
                                        ? 'bg-amber-50 text-amber-900'
                                        : 'bg-muted text-muted-foreground'
                                )}
                            >
                                <DeviceIcon type={icon} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-center gap-2">
                                    <p className="truncate text-sm leading-tight font-medium">
                                        {browser} on {os}
                                    </p>
                                    {isCurrent && (
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                                            Current
                                        </span>
                                    )}
                                </div>

                                <p className="text-muted-foreground mt-0.5 text-start text-xs">
                                    {device}
                                </p>
                                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                                    {session.ipAddress && (
                                        <div className="flex min-w-0 items-center gap-1">
                                            <WifiIcon className="text-muted-foreground h-3 w-3 shrink-0" />
                                            <p className="text-muted-foreground max-w-30 truncate font-mono text-[11px]">
                                                {session.ipAddress}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex shrink-0 items-center gap-1">
                                        <GlobeIcon className="text-muted-foreground h-3 w-3" />
                                        <p className="text-muted-foreground text-[11px] whitespace-nowrap">
                                            {timeAgo(session.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!isCurrent && (
                                <button
                                    onClick={() => handleRevoke(session.id)}
                                    disabled={isBeingRevoked || isRevoking}
                                    className={cn(
                                        'mt-0.5 flex h-7 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-medium transition-colors',
                                        'text-destructive hover:bg-destructive/10 active:bg-destructive/20',
                                        'disabled:cursor-not-allowed disabled:opacity-40'
                                    )}
                                >
                                    <LogOutIcon className="h-3 w-3" />
                                    <span className="hidden sm:inline">
                                        {isBeingRevoked ? 'Revoking…' : 'Revoke'}
                                    </span>
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            {expiredCount > 0 && (
                <p className="text-muted-foreground pt-1 pb-2 text-center text-[11px]">
                    {expiredCount} expired session{expiredCount !== 1 ? 's' : ''} not shown
                </p>
            )}
        </div>
    )
}
