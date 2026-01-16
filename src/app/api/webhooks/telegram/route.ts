import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        { success: false, message: "Missing required query parameter: workflowId" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const message = body?.message;
    if (!message) {
      return NextResponse.json({ success: true });
    }

    const telegramTriggerData = {
      updateId: body.update_id,
      chatId: message.chat.id,
      text: message.text ?? "",
      from: {
        id: message.from?.id,
        username: message.from?.username,
        firstName: message.from?.first_name,
      },
      raw: body,
    };

    // Trigger workflow execution
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        telegram: telegramTriggerData,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process Telegram event." },
      { status: 500 }
    );
  }
}
