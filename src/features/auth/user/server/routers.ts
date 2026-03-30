import prisma from '@/lib/db'
import { createTRPCRouter, protectedProcedure } from '@/trpc/init'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const userRouter = createTRPCRouter({
    getOne: protectedProcedure.query(({ ctx }) => {
        return prisma.user.findUnique({
            where: { id: ctx.auth.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                _count: { select: { workflows: true, credentials: true } },
            },
        })
    }),

    getSessions: protectedProcedure.query(async ({ ctx }) => {
        const sessions = await prisma.session.findMany({
            where: {
                userId: ctx.auth.user.id,
                expiresAt: { gt: new Date() },
            },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                ipAddress: true,
                userAgent: true,
                createdAt: true,
                updatedAt: true,
                expiresAt: true,
                token: true,
            },
        })
        return {
            currentSessionToken: ctx.auth.session.token,
            sessions,
        }
    }),

    revokeSession: protectedProcedure
        .input(z.object({ sessionId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const session = await prisma.session.findFirst({
                where: { id: input.sessionId, userId: ctx.auth.user.id },
            })
            if (!session) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Session not found',
                })
            }
            if (session.token === ctx.auth.session.token) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Cannot revoke your current session',
                })
            }
            return prisma.session.delete({ where: { id: input.sessionId } })
        }),

    update: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1, 'Name is required').max(100).optional(),
                email: z.string().email('Invalid email').optional(),
                image: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (input.email) {
                const existing = await prisma.user.findFirst({
                    where: { email: input.email, NOT: { id: ctx.auth.user.id } },
                })
                if (existing) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'Email already in use',
                    })
                }
            }
            return prisma.user.update({
                where: { id: ctx.auth.user.id },
                data: {
                    ...(input.name && { name: input.name }),
                    ...(input.email && { email: input.email, emailVerified: false }),
                    ...(input.image && { image: input.image }),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    emailVerified: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })
        }),
})
