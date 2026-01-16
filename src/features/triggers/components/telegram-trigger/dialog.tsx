"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
// import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectItem,SelectContent } from "@/components/ui/select";
import Image from "next/image";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const TelegramTriggerDialog = ({ open, onOpenChange }: Props) => {

const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
const [isSettingWebhook, setIsSettingWebhook] = useState(false);

    
    const params = useParams();
    const workflowId = params.workflowId as string;

    const { 
        data: credentials , 
        isLoading: isLoadingCredentials 
    } = useCredentialsByType(CredentialType.TELEGRAM);

    // Construct the webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/telegram?workflowId=${workflowId}`;

    // const telegramWebhookUrl = `https://api.telegram.org/bot${selectedCredential}/setWebhook?url=${webhookUrl}`;
    
    // const copyToClipboard = async () => {
    //     try {
    //         await navigator.clipboard.writeText(telegramWebhookUrl);
    //         toast.success("Webhook URL copied to clipboard!");
    //     } catch {
    //         toast.error("Failed to copy URL.");
    //     }
    // }

    const handleSetWebhook = async () => {
            try {
                setIsSettingWebhook(true);

                const res = await fetch("/api/webhooks/telegram/set-webhook", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                    credentialId: selectedCredential,
                    webhookUrl,
                    }),
                });

                const json = await res.json();

                if (!json.success) {
                    throw new Error(json.message);
                }

                toast.success("Telegram webhook configured successfully!");
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to set webhook");
            } finally {
                setIsSettingWebhook(false);
                }
        }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Telegram Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Configure this webhook URL in your Telegram Dashboard to trigger this workflow on events.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="credential">Credential</Label>

                        <div className="flex gap-2">
                            <Select
                                defaultValue={selectedCredential || ""}
                                disabled={isLoadingCredentials}
                                onValueChange={setSelectedCredential}
                            >
                            <SelectTrigger id="credential" className="w-full">
                                <SelectValue placeholder="Select a credential" />
                            </SelectTrigger>
                            <SelectContent>
                                {credentials?.map((credential) => (
                                <SelectItem key={credential.id} value={credential.id}>
                                    <div className="flex items-center gap-2">
                                    <Image
                                        src="/logos/telegram.svg"
                                        alt="Telegram"
                                        width={16}
                                        height={16}
                                    />
                                    {credential.name}
                                    </div>
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>

                            <Button
                            type="button"
                            disabled={!selectedCredential || isSettingWebhook}
                            onClick={handleSetWebhook}
                            >
                            {isSettingWebhook ? "Setting..." : "Set Webhook"}
                            </Button>
                        </div>
                    </div>

                    {/* <div className="space-y-2">
                        <Label htmlFor="webhook-url">
                            Webhook URL
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="webhook-url"
                                value={telegramWebhookUrl}
                                readOnly
                                className="font-mono text-sm"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={copyToClipboard}
                            >
                                <CopyIcon className="size-4" />
                            </Button>
                        </div>
                    </div> */}

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                    <h4 className="font-medium text-sm">
                        Setup Instructions
                    </h4>

                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Create a Telegram bot using <code>@BotFather</code></li>
                        <li>Copy your bot token</li>
                        <li>Select a Telegram credential above</li>
                        <li>Click <strong>Set Webhook</strong> to automatically register the webhook</li>
                        <li>Open Telegram and send <code>/start</code> to your bot</li>
                        <li>Every message sent to the bot will now trigger this workflow</li>
                    </ol>
                    </div>
                   
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                    <h4 className="font-medium text-sm">
                        Available Variables
                    </h4>

                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>
                        <code className="bg-background px-1 py-0.5 rounded">
                            {"{{telegram.text}}"}
                        </code>
                        {" "}– Message text sent by the user
                        </li>

                        <li>
                        <code className="bg-background px-1 py-0.5 rounded">
                            {"{{telegram.chatId}}"}
                        </code>
                        {" "}– Chat ID of the conversation
                        </li>

                        <li>
                        <code className="bg-background px-1 py-0.5 rounded">
                            {"{{telegram.from.username}}"}
                        </code>
                        {" "}– Username of the sender
                        </li>

                        <li>
                        <code className="bg-background px-1 py-0.5 rounded">
                            {"{{telegram.from.firstName}}"}
                        </code>
                        {" "}– First name of the sender
                        </li>

                        <li>
                        <code className="bg-background px-1 py-0.5 rounded">
                            {"{{telegram.from.id}}"}
                        </code>
                        {" "}– Telegram user ID
                        </li>

                        <li>
                        <code className="bg-background px-1 py-0.5 rounded">
                            {"{{json telegram}}"}
                        </code>
                        {" "}– Full Telegram trigger payload as JSON
                        </li>
                    </ul>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    )
}