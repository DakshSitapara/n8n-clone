import ForgotPasswordPage from '@/features/auth/components/forgot-password'
import { requireUnauth } from '@/lib/auth-utils'

const Page = async () => {
    await requireUnauth()

    return <ForgotPasswordPage />
}

export default Page
