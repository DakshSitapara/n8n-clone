import { VerifyEmailPage } from '@/features/auth/components/verify-email'
import { requireUnauth } from '@/lib/auth-utils'

const Page = async () => {
    await requireUnauth()

    return <VerifyEmailPage />
}

export default Page
