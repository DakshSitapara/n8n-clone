'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2Icon, MailIcon, ArrowLeftIcon, SendIcon } from 'lucide-react'
import { useState } from 'react'

const forgotSchema = z.object({
    email: z.email('Please enter a valid email address'),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
    const [resendCount, setResendCount] = useState(0)

    const form = useForm<ForgotFormValues>({
        resolver: zodResolver(forgotSchema),
        defaultValues: { email: '' },
    })

    const isSubmitting = form.formState.isSubmitting
    const isSubmitSuccessful = form.formState.isSubmitSuccessful
    const email = form.getValues('email')

    const onSubmit = async (values: ForgotFormValues) => {
        const { error } = await authClient.requestPasswordReset({ ...values })
        if (error) {
            toast.error(error.message)
            form.reset(values)
            return
        }
        setResendCount((c) => c + 1)
    }

    if (isSubmitSuccessful) {
        return (
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mb-2 flex justify-center">
                            <MailIcon className="text-muted-foreground h-8 w-8" />
                        </div>
                        <CardTitle>Check your inbox</CardTitle>
                        <CardDescription>
                            If an account exists for{' '}
                            <span className="text-foreground font-medium">{email}</span>, we sent a
                            password reset link. Check your spam folder too.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="border-border bg-muted/40 flex items-start gap-2.5 rounded-lg border px-4 py-3">
                            <div className="bg-primary/10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                                <span className="text-primary text-[10px] font-bold">!</span>
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                The link expires in{' '}
                                <span className="text-foreground font-medium">1 hour</span>. If it
                                expires, you can request a new one.
                            </p>
                        </div>
                        <div className="text-center text-sm">
                            <Link
                                href="/login"
                                className="text-muted-foreground underline underline-offset-4"
                            >
                                Back to login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Forgot password</CardTitle>
                    <CardDescription>
                        Enter your email and we&apos;ll send you a reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="m@example.com"
                                                autoComplete="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <SendIcon className="mr-2 h-4 w-4" />
                                        Send reset link
                                    </>
                                )}
                            </Button>
                            {resendCount > 0 && (
                                <p className="text-muted-foreground text-center text-xs">
                                    Resent {resendCount} time{resendCount > 1 ? 's' : ''}
                                </p>
                            )}
                            <div className="text-center text-sm">
                                <Link
                                    href="/login"
                                    className="text-muted-foreground inline-flex items-center gap-1 underline underline-offset-4"
                                >
                                    <ArrowLeftIcon className="h-3 w-3" />
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
