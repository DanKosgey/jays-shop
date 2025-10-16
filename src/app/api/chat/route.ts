import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { aiChatbot } from '@/ai/flows/ai-chatbot-customer-support';

const ChatInputSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().min(1),
  ticketNumber: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = ChatInputSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 });

    const { message, sessionId, ticketNumber } = parsed.data;
    const result = await aiChatbot({ message, sessionId, ticketNumber });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Chat error' }, { status: 500 });
  }
}
