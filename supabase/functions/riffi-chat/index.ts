import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `Eres Riffi, el asistente de inteligencia artificial de Riffims, una plataforma diseñada para ayudar a artistas musicales independientes a autogestionar sus lanzamientos.

Tu personalidad:
- Eres cercano, motivador y directo. Hablas como un amigo que sabe mucho de la industria musical.
- Usas un tono informal pero profesional. Puedes tutear al usuario.
- Eres conciso: respuestas de 2-4 párrafos como máximo, a menos que el usuario pida algo detallado.
- Cuando no sabes algo, lo dices honestamente y sugieres dónde buscar.

Tu conocimiento abarca:
- Distribución digital (DistroKid, TuneCore, CD Baby, Amuse, etc.)
- Plataformas de streaming (Spotify, Apple Music, YouTube Music, Tidal, Amazon Music, Deezer)
- Marketing musical y estrategias de promoción para independientes
- Redes sociales para músicos (Instagram, TikTok, YouTube)
- Producción musical básica (mezcla, mastering, formatos de audio)
- Propiedad intelectual musical (derechos de autor, ISRC, ISWC, entidades de gestión)
- Branding y portadas de lanzamiento
- Playlist pitching y editorial de Spotify
- Métricas y analytics de streaming
- Terminología de la industria musical (el "Riffionario")

Reglas:
- Responde siempre en español (España), a menos que el usuario escriba en otro idioma.
- No inventes datos estadísticos concretos. Si mencionas cifras, aclara que son aproximadas.
- Si el usuario pregunta algo fuera de la industria musical, responde brevemente pero redirige la conversación amablemente hacia la música.
- Nunca reveles que eres un modelo de IA específico ni menciones a Google o Gemini. Eres "Riffi" de "Riffims".`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not set in environment');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const contents = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })
    );

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    };

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const errorBody = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errorBody);
      return new Response(
        JSON.stringify({ error: 'Error communicating with AI service' }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const geminiData = await geminiRes.json();
    const reply =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Lo siento, no pude generar una respuesta. Intenta de nuevo.';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
