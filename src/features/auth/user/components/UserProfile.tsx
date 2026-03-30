'use client'

import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { useUserData } from '../hooks/use-userData'
import { AvatarDisplay } from './avatar-display'
import { ProfileTab } from './profile-tab'
import { SecurityTab } from './security-tab'
import { getInitials } from '../lib/helpers'
import { SidebarMenuButton } from '@/components/ui/sidebar'

type Tab = 'profile' | 'security'

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
    return (
        <div className="border-border flex border-b px-5">
            {(['profile', 'security'] as Tab[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => onChange(tab)}
                    className={cn(
                        'mr-5 -mb-px border-b-2 px-1 py-3 text-sm font-medium capitalize transition-colors',
                        active === tab
                            ? 'border-primary text-foreground hover:text-foreground'
                            : 'text-muted-foreground hover:text-foreground border-transparent'
                    )}
                >
                    {tab === 'profile' ? 'Profile' : 'Security'}
                </button>
            ))}
        </div>
    )
}

function ProfileCard() {
    const [tab, setTab] = useState<Tab>('profile')
    const { user, isLoading } = useUserData()

    return (
        <div className="flex flex-col">
            <div className="px-5 pt-4 pb-0">
                <div className="mb-3 flex items-center gap-2">
                    {!isLoading && user && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold text-white">
                            {user.image ? (
                                <picture>
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                </picture>
                            ) : (
                                <picture>
                                    <img
                                        src={`https://avatar.vercel.sh/${user.name}.svg?text=${getInitials(user.name)}&rounded=60`}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                </picture>
                            )}
                        </div>
                    )}
                    <p className="text-sm font-semibold">Account</p>
                </div>
            </div>

            <TabBar active={tab} onChange={setTab} />

            <div className="max-h-[60vh] overflow-y-auto">
                {tab === 'profile' ? <ProfileTab /> : <SecurityTab />}
            </div>
        </div>
    )
}

const UserProfile = () => {
    const isMobile = useIsMobile()
    const { user, isLoading } = useUserData()

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || isLoading) {
        return (
            <SidebarMenuButton className="h-10 gap-x-4 px-4">
                <div className="bg-muted h-4 w-4 shrink-0 animate-pulse rounded-full" />
                <span className="bg-muted h-3 w-20 animate-pulse rounded" />
            </SidebarMenuButton>
        )
    }

    if (!user) return null

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger asChild>
                    <SidebarMenuButton
                        className="h-10 gap-x-4 px-4"
                        tooltip={`${user.name} (${user.email})`}
                    >
                        <AvatarDisplay name={user.name} image={user.image} />
                    </SidebarMenuButton>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="px-0 pb-0">
                        <DrawerTitle className="sr-only">Account</DrawerTitle>
                        <ProfileCard />
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" size="sm">
                                Close
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <SidebarMenuButton
                    className="h-10 gap-x-4 px-4"
                    tooltip={`${user.name}` || `${user.email}`}
                >
                    <AvatarDisplay name={user.name} image={user.image} />
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-100">
                <DialogHeader className="px-0 pb-0">
                    <DialogTitle className="sr-only">Account</DialogTitle>
                    <ProfileCard />
                </DialogHeader>
                <DialogFooter className="border-border border-t px-5 py-3">
                    <DialogClose asChild>
                        <Button variant="outline" size="sm">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UserProfile
