import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),

        BETTER_AUTH_URL: z.string().url(),
        BETTER_AUTH_SECRET: z.string().min(1),

        GITHUB_CLIENT_ID: z.string().min(1),
        GITHUB_CLIENT_SECRET: z.string().min(1),
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),

        POLAR_SUCCESS_URL: z.string().url().optional(),
        POLAR_ACCESS_TOKEN: z.string().min(1),
        POLAR_PRODUCT_ID: z.string().min(1),

        ENCRYPTION_KEY: z.string().min(1),
        RESEND_API_KEY: z.string().min(1),
    },

    experimental__runtimeEnv: {},
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,

    onValidationError: (issues) => {
        console.error('❌ Invalid environment variables:')
        for (const issue of issues) {
            console.error(`  - ${issue.path}: ${issue.message}`)
        }
        process.exit(1)
    },
})
