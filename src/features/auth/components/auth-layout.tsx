import Link from "next/link";
import Image from "next/image";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-muted dark:bg-black min-h-svh gap-6 p-6 md:p-10">
            <div className="flex flex-col w-full max-w-sm gap-6">
                <Link className="flex items-center gap-2 self-center font-medium" href="/">
                    <Image src="/logos/logo.svg" alt="N8N Clone" width={30} height={30} />
                    N8N Clone
                </Link>
                {children}
            </div>
        </div>
    );
}