import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'

type Session = Awaited<ReturnType<typeof auth.api.getSession>>

const getSession = async (): Promise<Session> => {
    return auth.api.getSession({ headers: await headers() })
}

export const requireAuth = async (): Promise<NonNullable<Session>> => {
    const session = await getSession()

    if (!session) {
        redirect('/login')
    }

    if (!session.user.emailVerified) {
        redirect('/verify-email')
    }

    return session
}

export const requireUnauth = async (): Promise<null> => {
    const session = await getSession()

    if (session) {
        redirect(session.user.emailVerified ? '/' : '/verify-email')
    }

    return null
}

export const getOptionalSession = async (): Promise<Session> => {
    return getSession()
}

export const isAuthenticated = async (): Promise<boolean> => {
    const session = await getSession()
    return !!session?.user.emailVerified
}
