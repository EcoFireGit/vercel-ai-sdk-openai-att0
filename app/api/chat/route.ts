
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages, id } = await req.json();
    console.log('Received request:', { id, messageCount: messages.length });

    const result = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
      temperature: 0.7,
      async onFinish({ text, usage, finishReason }) {
        console.log('Chat completed:', { text, usage, finishReason });
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred processing your request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
