"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserData = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    ...trpc.user.getOne.queryOptions(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 500,
  });

  const { data, isLoading: isLoadingSessions } = useQuery({
    ...trpc.user.getSessions.queryOptions(),
    staleTime: 1000 * 60 * 2,
    retry: 1,
    retryDelay: 500,
  });

  const { mutateAsync: updateUser, isPending: isUpdating } = useMutation(
    trpc.user.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.user.getOne.queryFilter());
      },
    }),
  );

  const { mutateAsync: revokeSession, isPending: isRevoking } = useMutation(
    trpc.user.revokeSession.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.user.getSessions.queryFilter());
      },
    }),
  );

  return {
    user: user ?? null,
    isLoading,
    updateUser,
    isUpdating,
    sessions: data?.sessions ?? [],
    currentSessionToken: data?.currentSessionToken ?? null,
    isLoadingSessions,
    revokeSession,
    isRevoking,
  };
};
