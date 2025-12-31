"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectItem,SelectContent } from "@/components/ui/select";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const fromSchema = z.object({
    endpoint: z.url({ message: "Please enter a valid URL" }),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body: z
        .string()
        .optional()
        // .refine(),  TODO JSON5
});

export type FromType = z.infer<typeof fromSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof fromSchema>) => void;
    defultEndPoint?: string;
    defultMethod?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    defultBody?: string;
}

export const HttpRequestDialog = ({ open, onOpenChange, onSubmit, defultEndPoint = "", defultMethod = "GET", defultBody = "" }: Props) => {

    const form = useForm<z.infer<typeof fromSchema>>({
        resolver: zodResolver(fromSchema),
        defaultValues: {
            endpoint: defultEndPoint,
            method: defultMethod,
            body: defultBody,
        },
    });

    // Reset from values when dialog opens with defaults
    useEffect(() => {
        if (open) {
            form.reset({
                endpoint: defultEndPoint,
                method: defultMethod,
                body: defultBody,
            });
        }
    }, [open, defultEndPoint, defultMethod, defultBody, form]);

    const watchMethod = form.watch("method");
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

    const handleSubmit = (values: z.infer<typeof fromSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP Request node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
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
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The HTTP method to use for this request.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/users/{{httpResponse.data.id}}" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Static URL or use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {showBodyField && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Body</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder={'{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": "{{httpResponse.data.items}}"\n}'} 
                                                className="min-h-[120px] font-mono text-sm"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            JSON with template variables. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}