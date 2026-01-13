"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectItem,SelectContent } from "@/components/ui/select";
import Image from "next/image";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";

const methodOptions = [
    { value: "sendMessage", label: "Send Message" },
    { value: "sendPhoto", label: "Send Photo" },
    { value: "sendVideo", label: "Send Video" },
    { value: "sendDocument", label: "Send Document" },
    { value: "sendAudio", label: "Send Audio" },
    { value: "sendVoice", label: "Send Voice" },
];

const fromSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores" }),
    credentialId: z.string().min(1, { message: "Credential ID is required" }),
    method: z.string().min(1, { message: "Model is required" }),
    content : z.string().min(0, { message: "Message content is required" }).optional()
});

export type TelegramFromValues = z.infer<typeof fromSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof fromSchema>) => void;
    defultValue?: Partial<TelegramFromValues>;
}

export const TelegramDialog = ({ open, onOpenChange, onSubmit, defultValue = {}, }: Props) => {

    const { 
        data: credentials , 
        isLoading: isLoadingCredentials 
    } = useCredentialsByType(CredentialType.TELEGRAM);

    const form = useForm<z.infer<typeof fromSchema>>({
        resolver: zodResolver(fromSchema),
        defaultValues: {
            variableName: defultValue.variableName || "",
            credentialId: defultValue.credentialId || "",
            method: defultValue.method || "",
            content: defultValue.content || "",
        },
    });

    // Reset from values when dialog opens with defaults
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defultValue.variableName || "",
                credentialId: defultValue.credentialId || "",
                method: defultValue.method || "",
                content: defultValue.content || "",
            });
        }
    }, [open, defultValue, form]);

    const watchVariableName = form.watch("variableName") || "myTelegram";

    const handleSubmit = (values: z.infer<typeof fromSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Telegram Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Telegram webhook settings for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="myTelegram" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes: {" "} {`{{${watchVariableName}.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="credentialId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telegram Credential</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoadingCredentials || !credentials?.length}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a credential" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {credentials?.map((credential) => (
                                                <SelectItem key={credential.id} value={credential.id}>
                                                    <div className="flex items-center gap-2">
                                                    <Image src='/logos/telegram.svg' alt="Telegram" width={16} height={16} /> 
                                                    {credential.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {methodOptions.map((method) => (
                                                <SelectItem key={method.value} value={method.value}>
                                                    {method.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The Groq model to use for completion
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />                
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message Content</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Summarize: {{aiResponse.text}}" 
                                            className="min-h-[80px] font-mono text-sm"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The message to send. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}