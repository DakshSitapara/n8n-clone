"use client";

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export const Client = () => {
    const trcp = useTRPC();
    const { data : users } = useSuspenseQuery(trcp.getUsers.queryOptions());
    return (
        <div>
            <h1>Client</h1>
            <p>{JSON.stringify(users)}</p>
        </div>
    )
} 