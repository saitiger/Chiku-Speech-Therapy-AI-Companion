
// Follow this setup guide to integrate the Deno runtime into your project:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

interface TranscriptionRequest {
  audio: string; // base64 encoded audio
  analyzePatterns?: boolean; // whether to analyze speech patterns
}

interface AudioFeatures {
  audioData: number[];
  sampleRate: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

// Extract audio features from the raw audio data
function extractAudioFeatures(base64Audio: string): AudioFeatures {
  // Decode base64 to binary
  const binaryAudio = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
  
  // For WebM format, we need to extract the actual audio data
  // This is a simplified approach - in production would need a proper WebM parser
  // For now, we'll make some assumptions about the audio format
  
  // Convert to PCM floating point array (approximation)
  const audioData: number[] = [];
  const sampleRate = 24000; // Assuming 24kHz sample rate from browser recording
  
  // Simplistic conversion from bytes to float32 (scaled -1 to 1)
  // In a real implementation, this would depend on the actual audio encoding
  for (let i = 0; i < binaryAudio.length; i += 2) {
    if (i + 1 < binaryAudio.length) {
      // Convert 16-bit PCM to float
      const sample = ((binaryAudio[i+1] << 8) | binaryAudio[i]) / 32768.0;
      audioData.push(sample);
    }
  }
  
  return { audioData, sampleRate };
}

// Detect pauses in the audio
function detectPauses(audioData: number[], sampleRate: number): Array<{start: number, end: number, duration: number}> {
  const pauses: Array<{start: number, end: number, duration: number}> = [];
  const silenceThreshold = 0.015; // Threshold for silence detection
  const minPauseDuration = 0.3; // Minimum pause duration in seconds
  
  let inSilence = false;
  let silenceStart = 0;
  
  // Process in frames for efficiency
  const frameSize = Math.floor(sampleRate * 0.025); // 25ms frames
  const numFrames = Math.floor(audioData.length / frameSize);
  
  for (let i = 0; i < numFrames; i++) {
    const frameStart = i * frameSize;
    const frameEnd = Math.min((i + 1) * frameSize, audioData.length);
    const frame = audioData.slice(frameStart, frameEnd);
    
    // Calculate RMS energy of the frame
    let sumSquared = 0;
    for (const sample of frame) {
      sumSquared += sample * sample;
    }
    const rms = Math.sqrt(sumSquared / frame.length);
    
    if (rms < silenceThreshold) {
      // Start of silence
      if (!inSilence) {
        inSilence = true;
        silenceStart = frameStart / sampleRate;
      }
    } else {
      // End of silence
      if (inSilence) {
        inSilence = false;
        const silenceEnd = frameStart / sampleRate;
        const silenceDuration = silenceEnd - silenceStart;
        
        if (silenceDuration >= minPauseDuration) {
          pauses.push({
            start: silenceStart,
            end: silenceEnd,
            duration: silenceDuration
          });
        }
      }
    }
  }
  
  // Check if we're still in silence at the end
  if (inSilence) {
    const silenceEnd = audioData.length / sampleRate;
    const silenceDuration = silenceEnd - silenceStart;
    
    if (silenceDuration >= minPauseDuration) {
      pauses.push({
        start: silenceStart,
        end: silenceEnd,
        duration: silenceDuration
      });
    }
  }
  
  return pauses;
}

// Enhanced transcription with pause markers
function enhanceTranscription(text: string, pauses: Array<{start: number, end: number, duration: number}>): string {
  // Simple enhancement by adding pause markers at the end
  // In a production system, you would align pauses with the transcript using word timestamps
  let enhancedText = text;
  
  if (pauses.length > 0) {
    enhancedText += " (";
    
    pauses.forEach((pause, index) => {
      enhancedText += `${pause.duration.toFixed(1)}s pause`;
      if (index < pauses.length - 1) {
        enhancedText += ", ";
      }
    });
    
    enhancedText += ")";
  }
  
  return enhancedText;
}

// The main serve function that handles requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Check if Groq API key is configured
    if (!GROQ_API_KEY) {
      console.error("Groq API key not configured");
      return new Response(
        JSON.stringify({ error: "Groq API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log("Starting transcription request");
    
    // Parse request body
    const requestData = await req.json();
    const { audio, analyzePatterns = false } = requestData as TranscriptionRequest;
    
    if (!audio) {
      console.error("Missing audio data");
      return new Response(
        JSON.stringify({ error: "Missing audio data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Audio data received, length:", audio.length);
    
    // Extract audio features for pattern analysis if requested
    let audioFeatures: AudioFeatures | null = null;
    if (analyzePatterns) {
      console.log("Extracting audio features for pattern analysis");
      audioFeatures = extractAudioFeatures(audio);
    }
    
    // Process base64 audio in chunks to prevent memory issues
    try {
      // Convert base64 to binary
      const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
      console.log("Binary audio converted, length:", binaryAudio.length);
      
      // Create file from binary data
      const formData = new FormData();
      formData.append('file', new Blob([binaryAudio], { type: 'audio/webm' }), 'audio.webm');
      formData.append('model', 'whisper-large-v3');
      formData.append('language', 'en');
      formData.append('response_format', 'verbose_json'); // Request detailed output
      
      console.log("FormData created, calling Groq API");
      
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
      console.log("Transcription successful:", transcriptionData);
      
      // Get the regular text transcription
      let transcriptionText = transcriptionData.text || "";
      
      // Enhanced transcription with speech pattern analysis
      let enhancedText = transcriptionText;
      let speechPatterns = {
        pauses: [] as Array<{start: number, end: number, duration: number}>,
        hasStutters: false,
        hasProlongedSounds: false
      };
      
      // Perform speech pattern analysis if requested and we have audio features
      if (analyzePatterns && audioFeatures) {
        console.log("Analyzing speech patterns");
        
        // Detect pauses
        speechPatterns.pauses = detectPauses(audioFeatures.audioData, audioFeatures.sampleRate);
        console.log(`Detected ${speechPatterns.pauses.length} pauses`);
        
        // Enhance transcription with detected patterns
        enhancedText = enhanceTranscription(transcriptionText, speechPatterns.pauses);
        
        // Future: Add stutter detection and prolonged sound detection
        // These would require more sophisticated algorithms in a production system
      }
      
      return new Response(
        JSON.stringify({
          text: transcriptionText,
          enhancedText: enhancedText,
          speechPatterns
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (conversionError) {
      console.error("Error processing audio:", conversionError);
      throw new Error(`Error processing audio: ${conversionError.message}`);
    }
  } catch (error) {
    console.error("Edge function error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
