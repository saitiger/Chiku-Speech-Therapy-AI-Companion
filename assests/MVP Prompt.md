# 🗣️ Speech Therapy App MVP – Development Prompt

## 🧠 Project Overview

This MVP is a web-based speech therapy application designed for children aged **6–10** with speech and language disorders. It uses **interactive scenarios**, **adaptive difficulty levels**, and **gamification** to support therapy through fun and structured exercises.

---

## 📁 Assets Location

All design documents are in the `/assets` folder in this repository:

- `implementation_plan.md` – Adaptive difficulty, evaluation framework, engagement mechanics  
- `scenario_example_multilevels.md` – Multi-level café scenario  
- `evaluation_framework.md` – Evaluation metrics and SSIS scoring  
- `engagement_mechanics.md` – Rewards, customization, and engagement systems

---

## ✅ MVP Goals & Features

### 1. Scenario Implementation
- Implement **Café scenario** with **Beginner**, **Intermediate**, and **Advanced** levels
- Add **scenario selection** and navigation
- Build **dialogue flow system** with **visual supports** and branching logic

### 2. Adaptive Difficulty System
- Manual difficulty level selection (for MVP)
- Logic for recommending levels based on user performance
- Support difficulty switching across scenarios

### 3. Evaluation & Feedback
- Evaluate user responses using rubrics from `evaluation_framework.md`
- Provide **constructive feedback** with:
  - Positive reinforcement
  - Clear improvement tips  
- Feedback should vary by response quality:
  | Level        | Example Feedback |
  |--------------|------------------|
  | **Excellent** | "That was very clear—great articulation of the 'sh' sound!" |
  | **Good**      | "Nice try! Let’s say that a bit more slowly for clarity." |
  | **Needs Work**| "Let’s use the full sentence. Try saying it like this..." |

---

## 🧩 SSIS Score Logging (Therapist-Only)

- **SSIS scores** must be computed silently and stored (not shown to children)
- Tracked dimensions:  
  `Communication`, `Cooperation`, `Assertion`, `Responsibility`, `Empathy`, `Engagement`, `Self-Control`
- Example structure:
```json
{
  "userId": "child_001",
  "sessionId": "cafe_easy_01",
  "ssisScores": {
    "communication": 3,
    "assertion": 2,
    "engagement": 4,
    "selfControl": 3
  },
  "timestamp": "2025-05-04T15:20:00Z"
}
