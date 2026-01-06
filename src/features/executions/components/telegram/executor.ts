import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { telegramChannel } from "@/inngest/channels/telegram";
import { decode } from "html-entities";
import ky from "ky";

Handlebars.registerHelper('json', (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    
    return safeString;
} );

type TelegramData = {
    variableName? : string;
    webhookUrl? : string;
    content? : string;
    username? : string;
}

export const telegramExecutor: NodeExecutor<TelegramData> = async ({ data, nodeId, context, step, publish }) => {
    
    await publish(
        telegramChannel().status({
            nodeId,
            status: "loading",
        })
    );

    if(!data.variableName) {
        await publish(
            telegramChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Telegram node: Variable name is missing.");
    }

    if(!data.webhookUrl) {
        await publish(
            telegramChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Telegram node: Webhook URL is missing.");
    }
    
    if(!data.content) {
        await publish(
            telegramChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Telegram node: Content is missing.");
    }

    if(!data.username) {
        await publish(
            telegramChannel().status({
                nodeId,
                status: "error",
            })
        );
        throw new NonRetriableError("Telegram node: username is missing.");
    }

    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);
    const username = data.username ? decode(Handlebars.compile(data.username)(context)) : undefined;

    try {
        const result = await step.run("telegram-webhook", async () => {
            
            if(!data.webhookUrl) {
                await publish(
                    telegramChannel().status({
                        nodeId,
                        status: "error",
                    })
                );
                throw new NonRetriableError("Telegram node: Webhook URL is missing.");
            }

            await ky.post(`${data.webhookUrl}${data.content}`, {
                json: {
                    content : content.slice(0, 2000),
                    username
                },
            });

        if(!data.variableName) {
            await publish(
                telegramChannel().status({
                    nodeId,
                    status: "error",
                })
            );
            throw new NonRetriableError("Telegram node: Variable name is missing.");
        };

            return {
                ...context,
                [data.variableName]: {
                    messageContent: content.slice(0, 2000),
                }
            }
        })

        await publish(
            telegramChannel().status({
                nodeId,
                status: "success",
            })
        );

        return result;

    } catch (error) {
            await publish(
                telegramChannel().status({
                    nodeId,
                    status: "error",
                })
            );
            throw error;
        }
    };