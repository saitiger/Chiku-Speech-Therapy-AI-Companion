
// Follow this setup guide to integrate the Deno runtime into your project:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

interface TranscriptionRequest {
  audio: string; // base64 encoded audio
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      status: 204,
    });
  }

  try {
    // Check if Groq API key is configured
    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Groq API key not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { audio } = await req.json() as TranscriptionRequest;
    
    if (!audio) {
      return new Response(
        JSON.stringify({ error: "Missing audio data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Convert base64 to binary
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    
    // Create file from binary data
    const formData = new FormData();
    formData.append('file', new Blob([binaryAudio], { type: 'audio/webm' }), 'audio.webm');
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'en');
    
    // Call Groq Whisper API
    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: formData
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error("Groq API error:", errorData);
      throw new Error(`Groq API returned ${groqResponse.status}: ${errorData}`);
    }

    const transcriptionData = await groqResponse.json();
    
    return new Response(
      JSON.stringify({ text: transcriptionData.text }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
