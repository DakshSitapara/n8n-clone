import Link from 'next/link'
import Image from 'next/image'

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 dark:bg-black">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link className="flex items-center gap-2 self-center font-medium" href="/">
                    <Image src="/logos/logo.svg" alt="N8N Clone" width={30} height={30} />
                    N8N Clone
                </Link>
                {children}
            </div>
        </div>
    )
}
