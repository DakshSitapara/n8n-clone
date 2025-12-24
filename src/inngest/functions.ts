import { inngest } from "./client";
import  prisma  from "@/lib/db";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    //Fetching the video
    await step.sleep("Fetching the video", "5s");

    //Transcribing
    await step.sleep("Transcribing", "5s");

    // Sending transcription to AI
    await step.sleep("Sending transcription to AI", "5s");

    await step.run("create-workflow", () => {
        return prisma.workflow.create({
            data: {
                name: "workflow-from-inngest",
            },
        });
    });
  },
);