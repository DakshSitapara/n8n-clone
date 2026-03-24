"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircleIcon,
  Loader2Icon,
  MailIcon,
  XCircleIcon,
  ArrowLeftIcon,
  RefreshCwIcon,
} from "lucide-react";

type Status = "idle" | "verifying" | "success" | "error";

const AnimatedDots = () => (
  <span className="inline-flex items-center justify-center gap-1 ml-1 mb-0.5">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-current animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);

export const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(token ? "verifying" : "idle");
  const [countdown, setCountdown] = useState(3);
  const [resending, setResending] = useState(false);

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const userEmail = session?.user?.email ?? null;

  const resendVerification = async () => {
    if (!userEmail) {
      toast.error("No account found. Please sign in first.");
      return;
    }
    setResending(true);
    const { error } = await authClient.sendVerificationEmail({
      email: userEmail,
      callbackURL: "/verify-email",
    });
    setResending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Verification email sent to ${userEmail}`);
  };

  const logout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        const { error } = await authClient.verifyEmail({ query: { token } });
        if (error) {
          setStatus("error");
          return;
        }
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  useEffect(() => {
    if (status !== "success") return;
    if (countdown === 0) {
      router.push("/");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, router]);

  useEffect(() => {
    if (!sessionLoading && !session && !token) {
      router.push("/login");
    }
  }, [session, sessionLoading, token, router]);

  if (token) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            {status === "verifying" && (
              <>
                <div className="flex justify-center mb-2">
                  <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
                <CardTitle>Verifying your email</CardTitle>
                <CardDescription className="flex items-center justify-center gap-1">
                  Hang tight <AnimatedDots />
                </CardDescription>
              </>
            )}
            {status === "success" && (
              <>
                <div className="flex justify-center mb-2">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle>Email verified!</CardTitle>
                <CardDescription>
                  Your account is now active. Redirecting in{" "}
                  <span className="font-medium text-foreground tabular-nums">
                    {countdown}s
                  </span>
                  ...
                </CardDescription>
              </>
            )}
            {status === "error" && (
              <>
                <div className="flex justify-center mb-2">
                  <XCircleIcon className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle>Link expired</CardTitle>
                <CardDescription>
                  This link is invalid or has expired. Request a new one below.
                </CardDescription>
              </>
            )}
          </CardHeader>

          {status === "success" && (
            <CardContent className="pt-0">
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-1000"
                  style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                />
              </div>
            </CardContent>
          )}

          {status === "error" && (
            <CardContent className="grid gap-3">
              <Button
                onClick={resendVerification}
                disabled={resending || !userEmail}
                className="w-full"
              >
                {resending ? (
                  <>
                    <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    {userEmail ? `Resend to ${userEmail}` : "Resend link"}
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to login
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  if (sessionLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <CardTitle>Loading</CardTitle>
            <CardDescription>Please wait...</CardDescription>
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
            <MailIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Check your inbox</CardTitle>
          <CardDescription>
            We sent a verification link to{" "}
            {userEmail ? (
              <span className="font-medium text-foreground">{userEmail}</span>
            ) : (
              "your email address"
            )}
            . Click it to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 flex gap-2.5 items-start">
            <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">!</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Can&apos;t find it? Check your spam folder. The link expires in{" "}
              <span className="font-medium text-foreground">1 hour</span>.
            </p>
          </div>

          <Button
            onClick={resendVerification}
            disabled={resending || !userEmail}
            className="w-full"
          >
            {resending ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                {userEmail ? `Resend to ${userEmail}` : "Resend link"}
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={logout}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Sign out and use a different account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
