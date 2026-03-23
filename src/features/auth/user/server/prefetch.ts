import { prefetch, trpc } from "@/trpc/server";

export const prefetchUser = () => {
  return prefetch(trpc.user.getOne.queryOptions());
};
