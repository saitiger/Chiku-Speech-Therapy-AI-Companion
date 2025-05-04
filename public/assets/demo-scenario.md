
# Café Counter Scenario

## Beginner Level

```json
{
  "title": "Café Counter",
  "difficulty": "beginner",
  "description": "A scenario taking place at a café counter, practicing ordering skills, expressing preferences, and handling a problem politely.",
  "visual_background": "busy_cafe_scene.png",
  "steps": [
    {
      "step": 1,
      "prompt": "You're at the café counter. The barista asks: 'Hi there! What can I get for you today?' How do you order?",
      "intent": "Practice making a specific request",
      "visual_support": "menu_with_options.png",
      "audio_prompt": true,
      "character": "barista",
      "character_dialog": "Hi there! What can I get for you today?",
      "response_options": [
        {
          "text": "Um... chocolate.",
          "quality": "Needs Improvement",
          "feedback": "Try being more specific about what you want"
        },
        {
          "text": "Hot chocolate.",
          "quality": "Basic",
          "feedback": "Good choice! Can you make it a complete sentence?"
        },
        {
          "text": "I would like a small hot chocolate, please.",
          "quality": "Excellent",
          "feedback": "Excellent! Clear, complete request with good manners"
        }
      ]
    },
    {
      "step": 2,
      "prompt": "The barista asks: 'Would you like whipped cream on that?' What would you say?",
      "intent": "Practice expressing preference with detail",
      "visual_support": "drink_with_without_whipped_cream.png",
      "audio_prompt": true,
      "character": "barista",
      "character_dialog": "Would you like whipped cream on that?",
      "response_options": [
        {
          "text": "Yes.",
          "quality": "Basic",
          "feedback": "Good clear answer. You could add \"please\" to be more polite"
        },
        {
          "text": "Yes, please.",
          "quality": "Good",
          "feedback": "Good job being polite!"
        },
        {
          "text": "Yes, please. I love whipped cream on hot chocolate.",
          "quality": "Excellent",
          "feedback": "Excellent! You gave a clear answer, were polite, and added detail"
        }
      ]
    },
    {
      "step": 3,
      "prompt": "Your name is called, but they gave you the wrong drink. What would you say to the barista?",
      "intent": "Practice polite problem-solving",
      "visual_support": "wrong_drink.png",
      "audio_prompt": true,
      "character": "barista",
      "character_dialog": "Order for you! Here's your drink.",
      "situation_note": "The barista is holding coffee instead of hot chocolate",
      "response_options": [
        {
          "text": "That's wrong!",
          "quality": "Needs Improvement",
          "feedback": "Good for speaking up, but try using a more polite approach"
        },
        {
          "text": "Excuse me, I ordered hot chocolate, not coffee.",
          "quality": "Good",
          "feedback": "Good job explaining the problem clearly and politely"
        },
        {
          "text": "Excuse me, there seems to be a mix-up. I ordered a hot chocolate with whipped cream, not coffee.",
          "quality": "Excellent",
          "feedback": "Excellent! You explained the problem clearly, politely, and with specific details"
        }
      ]
    }
  ],
  "skills_targeted": {
    "speech_language": ["vocabulary", "grammar", "articulation"],
    "social_communication": ["clarity", "politeness", "problem-solving"]
  }
}
```

### Interactive Dialogue Format

**Scene Description:**
You're at a busy café, standing at the counter to order a drink.

**Barista:**
"Hi there! What can I get for you today?"

**Player Response Options:**
"Um... chocolate."
**Needs Improvement**
*Try being more specific about what you want*

"Hot chocolate."
**Basic**
*Good choice! Can you make it a complete sentence?*

"I would like a small hot chocolate, please."
**Excellent**
*Excellent! Clear, complete request with good manners*

**Barista:**
"Would you like whipped cream on that?"

**Player Response Options:**
"Yes."
**Basic**
*Good clear answer. You could add "please" to be more polite*

"Yes, please."
**Good**
*Good job being polite!*

"Yes, please. I love whipped cream on hot chocolate."
**Excellent**
*Excellent! You gave a clear answer, were polite, and added detail*

**Barista:**
"Order for you! Here's your drink."

**Player Response Options:**
"That's wrong!"
**Needs Improvement**
*Good for speaking up, but try using a more polite approach*

"Excuse me, I ordered hot chocolate, not coffee."
**Good**
*Good job explaining the problem clearly and politely*

"Excuse me, there seems to be a mix-up. I ordered a hot chocolate with whipped cream, not coffee."
**Excellent**
*Excellent! You explained the problem clearly, politely, and with specific details*
