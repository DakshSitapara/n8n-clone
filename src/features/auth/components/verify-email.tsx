'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    CheckCircleIcon,
    Loader2Icon,
    MailIcon,
    XCircleIcon,
    ArrowLeftIcon,
    RefreshCwIcon,
} from 'lucide-react'

type Status = 'verifying' | 'success' | 'error'

const AnimatedDots = () => (
    <span className="mb-0.5 ml-1 inline-flex items-center justify-center gap-1">
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
                style={{ animationDelay: `${i * 0.15}s` }}
            />
        ))}
    </span>
)

export const VerifyEmailPage = () => {
    const mounted = useRef(true)
    useEffect(() => {
        return () => {
            mounted.current = false
        }
    }, [])

    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<Status | null>(token ? 'verifying' : null)
    const [countdown, setCountdown] = useState(3)
    const [resending, setResending] = useState(false)
    const [timeOut, settimeOut] = useState(0)

    const { data: session, isPending: sessionLoading } = authClient.useSession()
    const userEmail = session?.user?.email ?? null

    useEffect(() => {
        if (!token) return
        const verify = async () => {
            try {
                const { error } = await authClient.verifyEmail({ query: { token } })
                setStatus(error ? 'error' : 'success')
            } catch {
                setStatus('error')
            }
        }
        verify()
    }, [token])

    useEffect(() => {
        if (status !== 'success') return
        if (countdown === 0) {
            if (mounted.current) router.push('/')
            return
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
        return () => clearTimeout(t)
    }, [status, countdown, router])

    useEffect(() => {
        if (timeOut === 0) return
        const t = setTimeout(() => settimeOut((c) => c - 1), 1000)
        return () => clearTimeout(t)
    }, [timeOut])

    useEffect(() => {
        if (!sessionLoading && !session && !token) {
            router.push('/login')
        }
    }, [session, sessionLoading, token, router])

    const resendVerification = async () => {
        if (!userEmail) {
            toast.error('No account found. Please sign in first.')
            return
        }
        setResending(true)
        const { error } = await authClient.sendVerificationEmail({
            email: userEmail,
            callbackURL: '/verify-email',
        })
        setResending(false)
        if (error) {
            toast.error(error.message)
            return
        }
        toast.success(`Verification email sent to ${userEmail}`)
        settimeOut(30)
    }

    const logout = async () => {
        await authClient.signOut()
        router.push('/login')
    }

    if (token) {
        return (
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader className="text-center">
                        {status === 'verifying' && (
                            <>
                                <div className="mb-2 flex justify-center">
                                    <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
                                </div>
                                <CardTitle>Verifying your email</CardTitle>
                                <CardDescription className="flex items-center justify-center gap-1">
                                    Hang tight <AnimatedDots />
                                </CardDescription>
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                <div className="mb-2 flex justify-center">
                                    <CheckCircleIcon className="h-8 w-8 text-green-500" />
                                </div>
                                <CardTitle>Email verified!</CardTitle>
                                <CardDescription>
                                    Your account is now active. Redirecting in{' '}
                                    <span className="text-foreground font-medium tabular-nums">
                                        {countdown}s
                                    </span>
                                    ...
                                </CardDescription>
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <div className="mb-2 flex justify-center">
                                    <XCircleIcon className="text-destructive h-8 w-8" />
                                </div>
                                <CardTitle>Link expired</CardTitle>
                                <CardDescription>
                                    This link is invalid or has expired. Request a new one below.
                                </CardDescription>
                            </>
                        )}
                    </CardHeader>

                    {status === 'success' && (
                        <CardContent className="pt-0">
                            <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                                <div
                                    className="h-full bg-green-500 transition-all duration-1000"
                                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                                />
                            </div>
                        </CardContent>
                    )}

                    {status === 'error' && (
                        <CardContent className="grid gap-3">
                            <Button
                                onClick={resendVerification}
                                disabled={resending || !userEmail}
                                className="w-full"
                            >
                                {resending ? (
                                    <>
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCwIcon className="mr-2 h-4 w-4" />
                                        {userEmail ? `Resend to ${userEmail}` : 'Resend link'}
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => router.push('/login')}
                            >
                                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                                Back to login
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </div>
        )
    }

    if (sessionLoading) {
        return (
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mb-2 flex justify-center">
                            <Loader2Icon className="text-muted-foreground h-8 w-8 animate-spin" />
                        </div>
                        <CardTitle>Loading</CardTitle>
                        <CardDescription>Please wait...</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <div className="mb-2 flex justify-center">
                        <MailIcon className="text-muted-foreground h-8 w-8" />
                    </div>
                    <CardTitle>Check your inbox</CardTitle>
                    <CardDescription>
                        We sent a verification link to{' '}
                        {userEmail ? (
                            <span className="text-foreground font-medium">{userEmail}</span>
                        ) : (
                            'your email address'
                        )}
                        . Click it to activate your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="border-border bg-muted/40 flex items-start gap-2.5 rounded-lg border px-4 py-3">
                        <div className="bg-primary/10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                            <span className="text-primary text-[10px] font-bold">!</span>
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            Can&apos;t find it? Check your spam folder. The link expires in{' '}
                            <span className="text-foreground font-medium">1 hour</span>.
                        </p>
                    </div>

                    <Button
                        onClick={resendVerification}
                        disabled={resending || !userEmail || timeOut > 0}
                        className="w-full"
                    >
                        {resending ? (
                            <>
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <RefreshCwIcon className="mr-2 h-4 w-4" />
                                {userEmail && timeOut > 0
                                    ? `Resend in ${timeOut}s`
                                    : `Resend to ${userEmail}`}
                            </>
                        )}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="border-border w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-card text-muted-foreground px-3">or</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={logout}>
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Sign out and use a different account
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
