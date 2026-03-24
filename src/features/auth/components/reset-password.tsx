"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Loader2Icon,
  KeyRoundIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from "lucide-react";
import { PasswordInput } from "./password-input";

const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const mounted = useRef(true);
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const onSubmit = async (values: ResetFormValues) => {
    if (!token) {
      toast.error("Missing reset token.");
      return;
    }
    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setSuccess(true);
  };

  useEffect(() => {
    if (!success) return;
    if (countdown === 0) {
      if (mounted.current) router.push("/login");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, router]);

  const isSubmitting = form.formState.isSubmitting;

  if (!token) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Invalid link</CardTitle>
            <CardDescription>
              This reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full">
              <Link href="/forgot-password">Request a new link</Link>
            </Button>
            <div className="text-sm text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 underline underline-offset-4 text-muted-foreground"
              >
                <ArrowLeftIcon className="h-3 w-3" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle>Password reset!</CardTitle>
            <CardDescription>
              Your password has been updated. Redirecting to login in
              <span className="font-medium text-foreground tabular-nums">
                {countdown}s
              </span>
            </CardDescription>
            <CardContent className="pt-0">
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-1000"
                  style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                />
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <KeyRoundIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
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
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
              <div className="text-sm text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 underline underline-offset-4 text-muted-foreground"
                >
                  <ArrowLeftIcon className="h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
