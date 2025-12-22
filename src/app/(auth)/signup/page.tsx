import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";

 const Page = async () => {

    await requireUnauth();
    
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterForm />
            </div>
        </div>
    );
};

export default Page;
