# Speech Therapy App MVP Development Prompt

## Project Overview

I'm building a speech therapy application for children (ages 6–10) with speech and language disorders. The app uses interactive scenarios, adaptive difficulty levels, and gamification to engage children in speech therapy exercises. The MVP includes simulated conversations and is being extended to support more advanced features.

## Asset Location

All design documents and reference materials are located in the GitHub repository under the `/assets` folder:

* `implementation_plan.md`: Adaptive difficulty, evaluation rubric, and engagement systems
* `scenario_example_multilevels.md`: Café scenario across all three difficulty levels
* `evaluation_framework.md`: Speech/language skill evaluation metrics and SSIS rubric
* `engagement_mechanics.md`: Reward system, progression, and mini-games

## MVP Scope & Feature Requirements

### 1. **Scenario Implementation**

* Implement the **café scenario** at beginner, intermediate, and advanced levels
* Create a scenario selection and navigation system
* Build a responsive dialogue flow system with visual supports

### 2. **Adaptive Difficulty System**

* Allow **manual selection** of difficulty levels for MVP
* Add **calibration logic** for difficulty recommendation
* Support **difficulty switching** between scenarios

### 3. **Evaluation & Feedback System**

* Implement scoring based on criteria in `evaluation_framework.md`
* Generate **constructive feedback** that supports improvement, not just encouragement
* Feedback must be:

  * Child-friendly
  * Specific to the error (e.g., articulation, fluency)
  * Balanced between praise and guidance
  * Example:

    * *“Nice effort! Let’s try saying the 'th' sound more clearly. Listen closely and try again!”*
* Categorize responses as **Excellent**, **Good**, or **Needs Work**, with tailored messages

### 4. **SSIS Score Logging (Not Shown to User)**

* Evaluate and **log SSIS scores** based on:

  * Communication, Cooperation, Assertion, Responsibility, Empathy, Engagement, Self-Control
* Scores must be stored (e.g., JSON or database) and tied to session/user
* These are for therapist use only — they must not be shown in the child UI

  * Example log:

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
```

### 5. **Engagement Features**

* Add **points and star reward system**
* Implement **basic avatar/character customization**
* Include **celebratory animations** for achievements

## Implementation Plan

### Frontend

* React-based, mobile/tablet responsive design
* Friendly visuals and animations
* Feedback UI with icons, audio cues, and progress indicators
* Accessibility: large buttons, simple color-coded feedback, ARIA labels where needed

### Data Format

* Use JSON to define scenarios:

  * Steps, speaker, visual supports
  * Difficulty tiers
  * Response options with evaluation metadata and feedback hooks

### Components to Build

1. **ScenarioPlayer** – Dialogue display, user choices, visual feedback
2. **EvaluationEngine** – Response scoring, feedback generation, SSIS computation
3. **ProgressTracker** – Logs user progress, performance, and stores SSIS metadata
4. **FeedbackSystem** – Renders feedback (text, visuals), adapts based on scoring tier
5. **RewardSystem** – Tracks stars, animations, avatar unlocks
6. **ScenarioSelector** – UI for picking scenarios and difficulty levels

## Development Instructions

1. Extract scenario data from `/assets/scenario_example_multilevels.md` into JSON
2. Use evaluation rubrics in `evaluation_framework.md` to score user responses
3. Add feedback logic that:

   * Evaluates response quality
   * Chooses feedback from a tiered message bank
   * Shows clear improvement tips when needed
4. Log SSIS scores in the background after each session using scoring criteria
5. Build a frontend flow that visually reflects both feedback and reward

## Final Deliverables

The MVP must include:

* Functional café scenario (all 3 levels)
* Manual difficulty selection + adaptive logic
* Evaluation with both child-facing feedback and therapist-only SSIS scoring
* Engaging visuals, rewards, and progress tracking
* Fully responsive and accessible UI for children
