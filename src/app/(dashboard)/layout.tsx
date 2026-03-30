import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { prefetchUser } from '@/features/auth/user/server/prefetch'
import { HydrateClient } from '@/trpc/server'

const Layout = ({ children }: { children: React.ReactNode }) => {
    prefetchUser()
    return (
        <HydrateClient>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="bg-accent/20">{children}</SidebarInset>
            </SidebarProvider>
        </HydrateClient>
    )
}

export default Layout
