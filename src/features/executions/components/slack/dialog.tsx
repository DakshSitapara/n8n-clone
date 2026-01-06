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

const fromSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, { message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores" }),
    username : z.string().optional(),
    content : z.string().min(1, { message: "Message content is required" }).max(2000, { message: "Slack message must be less than 2000 characters" }),
    webhookUrl : z.string().min(1, { message: "Webhook URL is required" }), 
});

export type SlackFromValues = z.infer<typeof fromSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof fromSchema>) => void;
    defultValue?: Partial<SlackFromValues>;
}

export const SlackDialog = ({ open, onOpenChange, onSubmit, defultValue = {}, }: Props) => {

    const form = useForm<z.infer<typeof fromSchema>>({
        resolver: zodResolver(fromSchema),
        defaultValues: {
            variableName: defultValue.variableName || "",
            username: defultValue.username || "",
            content: defultValue.content || "",
            webhookUrl: defultValue.webhookUrl || "",
        },
    });

    // Reset from values when dialog opens with defaults
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defultValue.variableName || "",
                username: defultValue.username || "",
                content: defultValue.content || "",
                webhookUrl: defultValue.webhookUrl || "",
            });
        }
    }, [open, defultValue, form]);

    const watchVariableName = form.watch("variableName") || "mySlack";

    const handleSubmit = (values: z.infer<typeof fromSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Slack webhook settings for this node.
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
                                            placeholder="mySlack" 
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
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Webhook URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://slack.com/api/webhooks/..." 
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Get this from Slack: Channel Settings ⟶ Integrations ⟶ Webhooks
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
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bot Username(Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Workflow Bot"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Override the webhook&#39;s default username
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