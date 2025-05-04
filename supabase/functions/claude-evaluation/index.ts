
// Follow this setup guide to integrate the Deno runtime into your project:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLAUDE_API_KEY = Deno.env.get("CLAUDE_API_KEY") || "";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

interface EvaluationRequest {
  childResponse: string;
  scenarioContext: string;
}

interface ApiError {
  error: string;
  details?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Check if Claude API key is configured
    if (!CLAUDE_API_KEY) {
      console.error("Claude API key not configured");
      return new Response(
        JSON.stringify({ error: "Claude API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const requestData = await req.json();
    const { childResponse, scenarioContext } = requestData as EvaluationRequest;
    
    if (!childResponse || !scenarioContext) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Received request to evaluate response:", childResponse.substring(0, 50) + "...");
    
    // Create system prompt for Claude
    const systemPrompt = `You are a licensed speech-language pathologist and child psychologist evaluating a child's speech therapy interaction. The child is between 6–10 years old and responded during a guided exercise in a speech therapy app. Use the following hybrid rubric to score and provide feedback.

### Evaluation Rubric (Rate each from 0–5):

**Speech & Language Skills**
1. Articulation: Accuracy and clarity of speech sounds.
2. Fluency: Smoothness and rhythm of speech.
3. Vocabulary Use: Variety and appropriateness of words.
4. Grammar/Sentence Structure: Sentence completeness and syntax.

**Social-Communication Skills**
5. Communication Clarity: How well the message was conveyed.
6. Empathy/Perspective-Taking: Recognition of emotions or social cues.
7. Cooperation/Social Cues: Turn-taking, politeness, and following directions.
8. Self-Control/Emotion Expression: Calmness, emotional regulation, appropriate tone.

Use a warm and supportive tone appropriate for children and therapists reviewing progress.`;

    // Create user prompt with child's response and scenario context
    const userPrompt = `
### Child Response:
${childResponse}

### Scenario Context:
${scenarioContext}

Please evaluate this response according to the rubric and return a JSON object with:
- Score for each of the 8 categories (0 to 5)
- A brief, friendly feedback comment for each category
- One overall encouraging message
- One constructive suggestion for next time

Format example (please include all these fields):
{
  "articulation": 4,
  "fluency": 3,
  "vocabulary": 5,
  "grammar": 4,
  "communication": 4,
  "empathy": 3,
  "cooperation": 5, 
  "selfControl": 4,
  "summary": "Great job explaining your ideas!",
  "suggestion": "Next time, try using more describing words.",
  "encouragement": "You're making wonderful progress!",
  "articulationFeedback": "Your speech sounds were very clear!",
  "fluencyFeedback": "You spoke at a nice, steady pace.",
  "vocabularyFeedback": "You used great words to tell your story!",
  "grammarFeedback": "Your sentences were complete and well-formed.",
  "communicationFeedback": "You explained your ideas clearly.",
  "empathyFeedback": "You showed understanding of others' feelings.",
  "cooperationFeedback": "You were polite and followed directions well.",
  "selfControlFeedback": "You expressed your thoughts calmly and clearly."
}

Important: Return ONLY the JSON object, nothing else, so it can be parsed directly.`;

    console.log("Calling Claude API...");
    
    // Call Claude API
    const claudeResponse = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.json();
      console.error("Claude API error:", errorData);
      throw new Error(`Claude API returned ${claudeResponse.status}: ${JSON.stringify(errorData)}`);
    }

    const claudeData = await claudeResponse.json();
    console.log("Claude API response received");
    
    const responseContent = claudeData.content?.[0]?.text || "{}";
    
    // Parse the JSON from Claude's response
    try {
      const feedbackData = JSON.parse(responseContent);
      console.log("Parsed feedback data successfully");
      
      return new Response(JSON.stringify(feedbackData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (parseError) {
      console.error("Failed to parse Claude's response as JSON:", responseContent);
      throw new Error("Failed to parse feedback data");
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
