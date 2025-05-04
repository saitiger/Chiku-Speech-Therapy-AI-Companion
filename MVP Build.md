# Speech Therapy App MVP 

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
````

---

## 🎮 Engagement Features

* Points and **stars reward system**
* Basic **character/avatar customization**
* Visual celebrations (e.g., confetti, animations) for achievements

---

## 🛠 Technical Implementation

### Frontend

* Built in **React**
* **Responsive** design for tablets/mobiles
* Friendly UI/UX with accessibility in mind
* Use icons, animations, and large buttons for children

### Data & Structure

* Use **JSON** for defining scenario dialogue steps and difficulty tiers
* State management for session progress and feedback delivery
* Store **SSIS scores** and evaluation logs per session

### Core Components

| Component          | Description                                    |
| ------------------ | ---------------------------------------------- |
| `ScenarioPlayer`   | Displays dialogue and handles user responses   |
| `EvaluationEngine` | Scores responses, selects feedback, logs SSIS  |
| `FeedbackSystem`   | Shows dynamic, visual feedback                 |
| `ProgressTracker`  | Stores performance and session data            |
| `RewardSystem`     | Handles stars, points, and character updates   |
| `ScenarioSelector` | Allows scenario and difficulty level selection |

---

## 🚧 Development Instructions

1. Parse café scenario JSON from `/assets/scenario_example_multilevels.md`
2. Implement response evaluation based on `evaluation_framework.md`
3. Show dynamic feedback with encouragement *and* improvement cues
4. Log SSIS scores per session silently
5. Implement visual reward system and point tracking
6. Make UI accessible and responsive

---

## 📦 MVP Deliverables

* ✅ Café scenario (Beginner, Intermediate, Advanced)
* ✅ Evaluation system with child-friendly feedback
* ✅ SSIS score logging (therapist-only)
* ✅ Manual difficulty selection + basic adaptive logic
* ✅ Stars, points, and reward animations
* ✅ Responsive and accessible UI

---

## 🔮 Future Iterations

* Add more real-world scenarios
* Integrate **speech recognition**
* Build **mini-games** and free-play tools
* Expand **character progression**
* Develop **therapist dashboard** with full SSIS analytics
* Add **parent/guardian controls and reports**

---

## 🧩 Data Loading Notes

* Extract scenario JSON from: `/assets/scenario_example_multilevels.md`
* Reference evaluation criteria in: `/assets/evaluation_framework.md`
* Implement feedback and rewards using: `/assets/engagement_mechanics.md`
