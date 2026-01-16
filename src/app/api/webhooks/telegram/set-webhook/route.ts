import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import ky from "ky";

export async function POST(req: NextRequest) {
  try {
    const { credentialId, webhookUrl } = await req.json();

    if (!credentialId || !webhookUrl) {
      return NextResponse.json(
        { success: false, message: "Missing credentialId or webhookUrl" },
        { status: 400 }
      );
    }

    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });

    if (!credential) {
      return NextResponse.json(
        { success: false, message: "Credential not found" },
        { status: 404 }
      );
    }

    const token = decrypt(credential.value);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Failed to decrypt Telegram token" },
        { status: 500 }
      );
    }

    const telegramUrl =
      `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;

    const res = await ky.get(telegramUrl).json<{ ok: boolean; description: string }>();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: res.description },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Telegram setWebhook error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to set webhook" },
      { status: 500 }
    );
  }
}
