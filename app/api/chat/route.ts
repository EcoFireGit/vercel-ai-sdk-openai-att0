
import { Configuration, OpenAIApi } from 'openai';
import { OpenAIStream, StreamingTextResponse } from '@ai-sdk/edge';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages, id } = await req.json();
    console.log('Received request:', { id, messageCount: messages.length });

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        stream: true,
      });

      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream);
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return new Response(
        JSON.stringify({ error: 'Error communicating with OpenAI' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
