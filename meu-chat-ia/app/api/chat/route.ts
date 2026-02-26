import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from 'ai';

const ollama = createOpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama', 
});

export async function POST(req: Request) {

    try {
        const body = await req.json();

        const { messages } = body;
        const coreMessages = messages.map((m: any) => ({
            role: m.role,
            content:
                m.parts
                ?.filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('') ?? '',
            }));
        const result = await streamText({
            model: ollama('llama3.2:1b'), 
            messages: coreMessages,
        });

        return result.toUIMessageStreamResponse();

    } catch (error) {

        return new Response(JSON.stringify({ error: "Erro interno  " }), { status: 500 });
    }
}
