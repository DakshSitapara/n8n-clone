"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormMessage, FormLabel,FormField,FormItem } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";

const registerSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const signInGithub = async () => {
        await authClient.signIn.social({
            provider: "github"
        },
        {
            onSuccess: () => {
                toast.success("Logged in successfully");
                router.push("/");
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            },
        })
    }

    const signInGoogle = async () => {
        await authClient.signIn.social({
            provider: "google"
        },
        {
            onSuccess: () => {
                toast.success("Logged in successfully");
                router.push("/");
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            },
        })
    }

    const onSubmit = async (values : RegisterFormValues) => {
        await authClient.signUp.email(
            {   
                name: values.email,
                email: values.email,
                password: values.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    toast.success("Account created successfully");
                    router.push("/");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            }
        )
    };

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>Create your account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button
                                        onClick={signInGithub}
                                        variant="outline"
                                        className="w-full"
                                        type="button"
                                        disabled={isPending}
                                    >
                                        <Image src="/logos/github.svg" width={20} height={20} alt="GitHub" />
                                        Continue with GitHub
                                    </Button>

                                    <Button
                                        onClick={signInGoogle}
                                        variant="outline"
                                        className="w-full"
                                        type="button"
                                        disabled={isPending}
                                    >
                                        <Image src="/logos/google.svg" width={20} height={20} alt="Google" />
                                        Continue with Google
                                    </Button>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email" 
                                                        placeholder="m@example.com"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password" 
                                                        placeholder="********"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password" 
                                                        placeholder="********"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-6">
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        disabled={isPending}
                                    >
                                        Sign up
                                    </Button>
                                </div>
                                <div className="text-sm text-center">
                                        Allready have an account?{" "} 
                                        <Link href="/login" className="underline underline-offset-4">
                                            Login
                                        </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}