'use client'

import {
    WorkflowIcon,
    KeyRoundIcon,
    CalendarIcon,
    HashIcon,
    MailIcon,
    UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserData } from '../hooks/use-userData'
import { EditableRow, ReadOnlyRow } from './profile-rows'
import { toast } from 'sonner'
import AvatarUpload from './avatar-upload'

function ProfileSkeleton() {
    return (
        <div className="flex animate-pulse flex-col">
            <div className="border-border border-b px-4 pt-5 pb-4 sm:px-5">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-muted h-12 w-12 shrink-0 rounded-full sm:h-14 sm:w-14" />
                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="bg-muted h-4 w-32 rounded-md" />
                        <div className="bg-muted h-3 w-44 rounded-md" />
                        <div className="bg-muted h-4 w-16 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="divide-border border-border grid grid-cols-3 divide-x border-b">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 py-3">
                        <div className="bg-muted h-3 w-3 rounded" />
                        <div className="bg-muted h-3.5 w-8 rounded" />
                        <div className="bg-muted h-2.5 w-12 rounded" />
                    </div>
                ))}
            </div>
            <div className="space-y-4 px-4 pt-4 pb-2 sm:px-5">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-3 py-2">
                        <div className="bg-muted mt-0.5 h-4 w-4 shrink-0 rounded" />
                        <div className="flex-1 space-y-2">
                            <div className="bg-muted h-2.5 w-16 rounded" />
                            <div className="bg-muted h-4 w-36 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function ProfileTab() {
    const { user, isLoading, updateUser, isUpdating } = useUserData()

    if (isLoading || !user) return <ProfileSkeleton />

    const stats = [
        {
            icon: WorkflowIcon,
            label: 'Workflows',
            value: user._count?.workflows ?? 0,
        },
        {
            icon: KeyRoundIcon,
            label: 'Credentials',
            value: user._count?.credentials ?? 0,
        },
        {
            icon: CalendarIcon,
            label: 'Joined',
            value: new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
            }),
        },
    ]

    return (
        <div className="flex flex-col">
            <div className="border-border border-b px-4 pt-5 pb-4 sm:px-5">
                <div className="flex items-center gap-3 sm:gap-4">
                    <AvatarUpload
                        name={user.name}
                        image={user.image}
                        emailVerified={user.emailVerified}
                        onUpload={async (base64) => {
                            await updateUser({ image: base64 })
                            toast.success('Profile picture updated')
                        }}
                    />

                    <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm leading-tight font-semibold sm:text-base">
                            {user.name}
                        </p>
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                            {user.email}
                        </p>
                        <span
                            className={cn(
                                'mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide',
                                user.emailVerified
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            )}
                        >
                            <span
                                className={cn(
                                    'h-1.5 w-1.5 rounded-full',
                                    user.emailVerified ? 'bg-emerald-500' : 'bg-amber-400'
                                )}
                            />
                            {user.emailVerified ? 'Verified' : 'Unverified'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="divide-border border-border bg-muted/20 grid grid-cols-3 divide-x border-b text-left">
                {stats.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex flex-col items-center gap-0.5 py-3">
                        <Icon className="text-muted-foreground mb-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <p className="text-xs leading-none font-semibold tabular-nums sm:text-sm">
                            {value}
                        </p>
                        <p className="text-muted-foreground text-[9px] sm:text-[10px]">{label}</p>
                    </div>
                ))}
            </div>

            <div className="px-4 pt-1 pb-2 text-left sm:px-5">
                <p className="text-muted-foreground mt-3 mb-1 text-[10px] font-semibold tracking-widest uppercase">
                    Profile
                </p>
                <EditableRow
                    icon={UserIcon}
                    label="Full name"
                    value={user.name}
                    saving={isUpdating}
                    validate={(v) => (v.trim().length < 1 ? 'Name cannot be empty' : null)}
                    onSave={async (name) => {
                        await updateUser({ name })
                        toast.success('Name updated')
                    }}
                />
                <EditableRow
                    icon={MailIcon}
                    label="Email address"
                    value={user.email}
                    type="email"
                    saving={isUpdating}
                    validate={(v) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter a valid email'
                    }
                    onSave={async (email) => {
                        await updateUser({ email })
                        toast.success('Email updated — please re-verify')
                    }}
                />
            </div>

            <div className="border-border border-t px-4 pb-3 text-left sm:px-5">
                <p className="text-muted-foreground mt-3 mb-1 text-[10px] font-semibold tracking-widest uppercase">
                    Account
                </p>
                <ReadOnlyRow icon={HashIcon} label="User ID" value={user.id} mono />
            </div>
        </div>
    )
}
