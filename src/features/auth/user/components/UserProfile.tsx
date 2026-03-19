"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserData } from "../hooks/use-userData";
import { AvatarDisplay } from "./avatar-display";
import { ProfileTab } from "./profile-tab";
import { SecurityTab } from "./security-tab";
import { getInitials } from "../lib/helpers";

type Tab = "profile" | "security";

function TabBar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div className="flex border-b border-border px-5">
      {(["profile", "security"] as Tab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "px-1 py-3 mr-5 text-sm font-medium border-b-2 -mb-px transition-colors capitalize",
            active === tab
              ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tab === "profile" ? "Profile" : "Security"}
        </button>
      ))}
    </div>
  );
}

function ProfileCard() {
  const [tab, setTab] = useState<Tab>("profile");
  const { user, isLoading } = useUserData();

  return (
    <div className="flex flex-col">
      <div className="px-5 pt-4 pb-0">
        <div className="flex items-center gap-2 mb-3">
          {!isLoading && user && (
            <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
              {user.image ? (
                <picture>
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </picture>
              ) : (
                getInitials(user.name)
              )}
            </div>
          )}
          <p className="text-sm font-semibold">Account</p>
        </div>
      </div>

      <TabBar active={tab} onChange={setTab} />

      <div className="overflow-y-auto max-h-[60vh]">
        {tab === "profile" ? <ProfileTab /> : <SecurityTab />}
      </div>
    </div>
  );
}

const UserProfile = () => {
  const isMobile = useIsMobile();
  const { user, isLoading } = useUserData();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <>
        <div className="h-4 w-4 rounded-full bg-muted animate-pulse shrink-0" />
        <span className="h-3 w-20 rounded bg-muted animate-pulse" />
      </>
    );
  }

  if (!user) return null;

  if (isMobile) {
    return (
      <>
        <AvatarDisplay
          name={user.name}
          image={user.image}
          onClick={() => setOpen(true)}
        />
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="pb-0 px-0">
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
      </>
    );
  }

  return (
    <>
      <AvatarDisplay
        name={user.name}
        image={user.image}
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-100 p-0 gap-0 overflow-hidden">
          <ProfileCard />
          <DialogFooter className="px-5 py-3 border-t border-border">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;
