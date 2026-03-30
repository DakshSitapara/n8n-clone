import ResetPasswordPage from '@/features/auth/components/reset-password'
import { requireUnauth } from '@/lib/auth-utils'

const Page = async () => {
    await requireUnauth()

    return <ResetPasswordPage />
}

export default Page
