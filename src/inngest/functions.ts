import { inngest } from "./client";
import  prisma  from "@/lib/db";
import * as Sentry from "@sentry/nextjs";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';

  const google = createGoogleGenerativeAI();
  const openai = createOpenAI();
  const anthropic = createAnthropic();
  const groq = createGroq();
  
export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");

    Sentry.logger.info('User triggered testlog', { log_source: 'sentry_test' });
    console.warn("Somthing is wrong");
    console.error("This is an error i went to track");

    const { steps : googleSteps } = await step.ai.wrap(
      "gemini-generate-text",
       generateText,
       {
        model: google('gemini-2.5-flash'),
        system: 'You are a helpful assistant.',
        prompt: 'what is the meaning of death?',
        experimental_telemetry: {
              isEnabled: true,
              recordInputs: true,
              recordOutputs: true,
          },
      }
    );

    const { steps : openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
       generateText,
       {
        model: openai('gpt-4'),
        system: 'You are a helpful assistant.',
        prompt: 'what is the meaning of death?',
        experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
          },
      }
    );

    const { steps : anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
       generateText,
       {
        model: anthropic('claude-sonnet-4-5'),
        system: 'You are a helpful assistant.',
        prompt: 'what is the meaning of death?',
        experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
          },
      }
    );

    const { steps : groqSteps } = await step.ai.wrap(
      "groq-generate-text",
       generateText,
       {
        model: groq('openai/gpt-oss-120b'),
        system: 'You are a helpful assistant.',
        prompt: 'what is the meaning of death?',
        experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
          },
      }
    );
    return {
      groqSteps,
      googleSteps,
      openaiSteps,
      anthropicSteps,
    };
  },
);
