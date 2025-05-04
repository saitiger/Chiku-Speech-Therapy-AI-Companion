# Multi-Level Scenario: Café Counter

Below is an implementation of the café scenario across three difficulty levels, showing how content, support, and expectations adapt based on the child's abilities.

## Beginner Level

### Scenario Structure
```json
{
  "scenario": [
    { 
      "step": 1, 
      "prompt": "You're at the café. The barista asks: 'What would you like to drink?' What do you say?", 
      "intent": "Practice making a simple request",
      "visual_support": "menu_with_3_drink_options.png",
      "audio_prompt": true
    },
    { 
      "step": 2, 
      "prompt": "The barista asks: 'Would you like a small or big cup?' What do you say?", 
      "intent": "Practice making a simple choice",
      "visual_support": "small_and_large_cups.png",
      "audio_prompt": true
    },
    { 
      "step": 3, 
      "prompt": "Your drink is ready. The barista says: 'Here's your drink!' What do you say?", 
      "intent": "Practice basic politeness",
      "visual_support": "barista_with_drink.png",
      "audio_prompt": true
    }
  ]
}
```

### Interactive Dialogue Format

**Scene Description:**
You're at a café. There's a friendly barista behind the counter.

**Barista:** [smiling, gesturing to menu]
"What would you like to drink?"
[Visual: Simple menu with 3 clear drink options with pictures]

**Player Response Options:**
[Points without speaking]
**Needs Improvement**
*Remember to use your words to order*

"Hot chocolate."
**Good**
*Good job saying what you want!*

"I want hot chocolate, please."
**Excellent**
*Excellent! You said what you want and used "please"!*

**Barista:**
"Would you like a small or big cup?"
[Visual: Picture of small and large cups]

**Player Response Options:**
[Points to small cup]
**Basic**
*Good choice! Try using your words too*

"Small."
**Good**
*Good clear answer!*

"Small cup, please."
**Excellent**
*Excellent! Clear answer and polite too!*

**Barista:**
"Here's your drink!"
[Visual: Barista holding out drink with smile]

**Player Response Options:**
[Takes drink silently]
**Needs Improvement**
*Remember to say "thank you" when someone gives you something*

"Thanks."
**Good**
*Good! You showed gratitude!*

"Thank you very much!"
**Excellent**
*Excellent! Very polite response!*

## Intermediate Level

### Scenario Structure
```json
{
  "scenario": [
    { 
      "step": 1, 
      "prompt": "You're at the café counter. The barista asks: 'Hi there! What can I get for you today?' How do you order?", 
      "intent": "Practice making a specific request",
      "visual_support": "menu_with_options.png",
      "audio_prompt": true
    },
    { 
      "step": 2, 
      "prompt": "The barista asks: 'Would you like whipped cream on that?' What would you say?", 
      "intent": "Practice expressing preference with detail",
      "visual_support": "drink_with_without_whipped_cream.png",
      "audio_prompt": true
    },
    { 
      "step": 3, 
      "prompt": "Your name is called, but they gave you the wrong drink. What would you say to the barista?", 
      "intent": "Practice polite problem-solving",
      "visual_support": "wrong_drink.png",
      "audio_prompt": true
    }
  ]
}
```

### Interactive Dialogue Format

**Scene Description:**
You're standing at a café counter with several other customers waiting in line.

**Barista:**
"Hi there! What can I get for you today?"
[Visual: Menu with various options]

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
[Visual: Drink with and without whipped cream]

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

**Barista:** [calling your name]
"Order for [child's name]!"
[Visual: Barista holding coffee instead of hot chocolate]

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

## Advanced Level

### Scenario Structure
```json
{
  "scenario": [
    { 
      "step": 1, 
      "prompt": "You're at a busy café and it's your turn to order. How would you greet the barista and place your order?", 
      "intent": "Practice social greeting and detailed ordering",
      "visual_support": "busy_cafe_scene.png",
      "audio_prompt": false
    },
    { 
      "step": 2, 
      "prompt": "The barista says they're out of hot chocolate but have white hot chocolate instead. How do you respond?", 
      "intent": "Practice adapting to unexpected situations",
      "visual_support": null,
      "audio_prompt": false
    },
    { 
      "step": 3, 
      "prompt": "While waiting, someone accidentally bumps into you. How do you handle this situation?", 
      "intent": "Practice appropriate social response to accidents",
      "visual_support": null,
      "audio_prompt": false
    },
    { 
      "step": 4, 
      "prompt": "Your drink is ready, but you realize you forgot to bring enough money. What would you say to the barista?", 
      "intent": "Practice handling a problem and finding a solution",
      "visual_support": null,
      "audio_prompt": false
    }
  ]
}
```

### Interactive Dialogue Format

**Scene Description:**
You're at a busy café with a long line behind you. It's now your turn to order.

**Narrator:**
"You're at a busy café and it's your turn to order. How would you greet the barista and place your order?"

**Player Response Options:**
"Give me a hot chocolate."
**Needs Improvement**
*Remember to start with a greeting and use polite language when ordering*

"Hi, can I have a small hot chocolate please?"
**Good**
*Good job including a greeting and being polite*

"Good morning! I'd like a small hot chocolate with whipped cream, please. For here, not to go."
**Excellent**
*Excellent! You included a greeting, complete details, and were very polite*

**Barista:**
"I'm sorry, we're actually out of regular hot chocolate. We do have white hot chocolate though. Would that work?"

**Player Response Options:**
"No, I wanted hot chocolate!" [looking upset]
**Needs Improvement**
*It's okay to be disappointed, but try to respond more flexibly*

"OK, I'll take that instead."
**Good**
*Good job being flexible when your first choice wasn't available*

"I haven't tried white hot chocolate before. What does it taste like? I think I'll try it if it's not too sweet."
**Excellent**
*Excellent! You asked for more information and showed thoughtful decision-making*

**Narrator:**
"While waiting for your drink, someone accidentally bumps into you from behind."

**Player Response Options:**
[Glares at person without speaking]
**Needs Improvement**
*When accidents happen, it's best to communicate with words*

"That's okay."
**Good**
*Good response showing understanding*

"That's okay, no problem. It was pretty crowded in here."
**Excellent**
*Excellent! You were understanding and recognized the circumstances*

**Narrator:**
"Your drink is ready, but when you reach for your money, you realize you don't have enough."

**Player Response Options:**
"I don't have enough money." [looks down]
**Basic**
*Good for being honest, but try suggesting a solution*

"I'm sorry, I don't have enough money. Can I just have a small size instead?"
**Good**
*Good job apologizing and offering a solution*

"I'm really sorry, but I just realized I don't have enough money for this drink. Could I get a smaller size that costs less, or could I leave what I have and come back with the rest in 5 minutes? My parent is right outside."
**Excellent**
*Excellent! You apologized, explained clearly, and offered multiple solutions*
