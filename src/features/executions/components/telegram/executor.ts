import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { telegramChannel } from "@/inngest/channels/telegram";
import { decrypt } from "@/lib/encryption";
import ky from "ky";
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (context) => {
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

const TELEGRAM_METHOD_FIELD_MAP = {
  sendMessage: "text",
  sendPhoto: "photo",
  sendVideo: "video",
  sendDocument: "document",
  sendAudio: "audio",
  sendVoice: "voice",
} as const;

type TelegramMethod = keyof typeof TELEGRAM_METHOD_FIELD_MAP;

type TelegramData = {
  variableName?: string;
  credentialId?: string;
  method?: TelegramMethod;
  content?: string;
};

export const telegramExecutor: NodeExecutor<TelegramData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
  userId,
}) => {
  await publish(telegramChannel().status({ nodeId, status: "loading" }));

  if (!data.variableName) throwError(nodeId, publish, "Variable name is missing.");
  if (!data.credentialId) throwError(nodeId, publish, "Credentials is missing.");
  if (!data.method) throwError(nodeId, publish, "Method is missing.");
  if (!data.content) throwError(nodeId, publish, "Content is missing.");

  const content = Handlebars.compile(data.content)(context);

  const credentials = await step.run("get-credential", async () => {
    return prisma.credential.findUnique({
      where: { id: data.credentialId, userId },
    });
  });

  if (!credentials) {
    throwError(nodeId, publish, "Credentials not found.");
  }

  const token = decrypt(credentials.value);
  if (!token) {
    throwError(nodeId, publish, "Failed to decrypt Telegram token.");
  }

  const chat_id = await step.run("telegram-get-chat-id", async () => {
    const res = await ky.get(
      `https://api.telegram.org/bot${token}/getUpdates`
    );

    const body = (await res.json()) as {
      result: Array<{ message?: { chat: { id: number } } }>;
    };

    const msg = body.result.find((u) => u.message?.chat?.id);
    if (!msg) {
      throw new NonRetriableError(
        "Telegram node: No chat_id found. Send a message to the bot first."
      );
    }

    return msg.message!.chat.id;
  });

  try {
    const result = await step.run("telegram-send", async () => {
      const field = TELEGRAM_METHOD_FIELD_MAP[data.method!];

      const payload: Record<string, unknown> = {
        chat_id,
      };

      if (field === "text") {
        payload.text = content.slice(0, 4096);
        payload.parse_mode = "HTML";
      } else {
        payload[field] = content;
      }

      await ky.post(
        `https://api.telegram.org/bot${token}/${data.method}`,
        { json: payload }
      );

      return {
        ...context,
        [data.variableName!]: {
          method: data.method,
          content,
          chat_id,
        },
      };
    });

    await publish(telegramChannel().status({ nodeId, status: "success" }));
    return result;
  } catch (error) {
    await publish(telegramChannel().status({ nodeId, status: "error" }));
    throw error;
  }
};

function throwError(
  nodeId: string,
  publish: any,
  message: string
): never {
  publish(telegramChannel().status({ nodeId, status: "error" }));
  throw new NonRetriableError(`Telegram node: ${message}`);
}
