"use client";

import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { Logout } from "./logout";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page =  () => {

  // await requireAuth();

  // const data = await caller.getUsers();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(trpc.createWorkflow.mutationOptions(
    {
      onSuccess: () => {
        toast.success("Job queued");
      }
    }
  ));
  
  return (
    <div className=" flex flex-col min-h-screen min-w-screen gap-6 items-center justify-center">
      <h1 className="text-2xl">Hello, I am the protected page</h1>
      <p>{JSON.stringify(data , null, 2)}</p>
      <Button
        disabled={create.isPending}
        onClick={() => {
          create.mutate();
        }}
      >
        Create
      </Button>
      <Logout />
    </div>
  );
}

export default Page