## Chiku - AI Speech Therapy App

A web-based speech therapy application designed to help children (ages 6–10) with speech and language disorders improve their communication skills through interactive, gamified scenarios.

---

## 📌 Project Overview

This MVP focuses on a real-world café scenario implemented across three difficulty levels (Beginner, Intermediate, Advanced). The app helps children practice speaking in natural settings using dialogue flows, visual cues, rewards, and adaptive difficulty. It uses AI-driven evaluation and logs **SSIS (Social Skills Improvement System)** scores for therapist use — all while keeping the experience playful and encouraging for kids.

---

## 💡 Key Features

- 🎭 **Interactive Roleplay Scenarios**  
  Real-world situations like ordering at a café with dialogue options and visual context.

- 🧠 **Adaptive Difficulty Levels**  
  Manual selection for MVP; future support for AI-based calibration.

- 🗣️ **Speech Evaluation Engine**  
  Evaluates responses using Whisper transcription, inferred disfluencies, and a 3-part scoring rubric.

- 🌟 **Child-Friendly Feedback**  
  Constructive and motivational feedback to encourage retry and improvement.

- 🎮 **Gamification & Engagement**  
  Reward points, stars, character customization, and celebratory animations.

- 📊 **Progress Tracking Dashboard**  
  Logs performance and SSIS skill ratings for therapists (not visible to children).

---

## 🛠️ Tech Stack

| Layer         | Technology           |
|---------------|----------------------|
| **Frontend**  | React, Tailwind CSS  |
| **Speech Input** | Whisper (OpenAI) |
| **Evaluation Logic** | LLM-based scoring + JSON-based rubrics |
| **Data Format** | JSON for scenario definitions and evaluation rules |
| **Deployment** | Web (mobile/tablet-first design) |

---

## 🧩 App Architecture
User ↔ React UI ↔ Scenario Player ↔ Whisper Transcription ↔ LLM Evaluation Engine
↓
SSIS Score Logger (internal use)


---

## 📁 File Structure (Key Assets)

- `/assets/scenario_example_multilevels.md`  
  JSON scenario data for café roleplay at all difficulty levels

- `/assets/evaluation_framework.md`  
  Evaluation rubric covering articulation, fluency, and prosody

- `/assets/engagement_mechanics.md`  
  Rewards, progression, and gamification ideas

- `/src/components/ScenarioPlayer.jsx`  
  React component that renders dialogues and feedback

---

## 🚀 Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/Chiku-Speech-Therapy-AI-Companion.git
   cd speech-therapy-app
2. **Install Dependencies**
   ```
   npm install
3. **Run the app locally**
   ```
   npm run dev
   
⚙️ Implementation Details
Dialogue System:
Reads from scenario JSON with multi-level difficulty and response options.

Evaluation Engine:
Prompts an LLM with a Whisper transcript and scenario context to generate feedback and scores.

SSIS Logging:
Logged privately for therapist dashboards and analysis, not visible to children.

Visual Feedback:
Animated stars, progress badges, and retry prompts support engagement.

🔍 Challenges Faced

⚖️ Balancing Support vs Accuracy:
Early versions gave overly positive feedback. Now rebalanced to focus on learning without discouragement.

🧠 Handling Whisper “Perfection”:
Whisper’s clean transcripts hid real fluency issues. Prompt updated to infer disfluency from syntax and phrasing.
Researched on ways augment the transcribed text to improve the final output

⚙️ Child-Centered Design:

Designing an accessible, fun, and intuitive UI while collecting clinically relevant data like SSIS scores.

🔒 Separation of Feedback and Scoring:
SSIS data is logged for professionals only, ensuring children are not exposed to evaluative metrics.

📈 Next Steps (Post-MVP)

Add more scenarios (e.g., doctor visit, birthday party)

Integrate speech recognition-based pronunciation feedback

Build a full therapist dashboard with analytics and reporting

Expand gamification with mini-games and avatar growth

Enable offline functionality for classroom or clinic use


