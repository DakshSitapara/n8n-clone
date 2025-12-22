'use client';

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const Logout = () => {
    const router = useRouter();
    
    return( 
    <Button 
        onClick={ () => authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push('/login')
                        }
                    }
                 })
            }
    >
        Logout
    </Button>
    );
};