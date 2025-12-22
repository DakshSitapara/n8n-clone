

import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { Logout } from "./logout";

const Page = async () => {

  await requireAuth();

  const data = await caller.getUsers();
  
  return (
    <div className=" flex flex-col min-h-screen min-w-screen gap-6 items-center justify-center">
      <h1 className="text-2xl">Hello, I am the protected page</h1>
      <p>{JSON.stringify(data)}</p>
      <Logout />
    </div>
  );
}

export default Page