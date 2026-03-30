import { Resend } from 'resend'
import { env } from './env'

const resend = new Resend(env.RESEND_API_KEY)

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string
    subject: string
    html: string
}) => {
    await resend.emails.send({
        from: 'N8N Clone <onboarding@resend.dev>',
        to,
        subject,
        html,
    })
}
