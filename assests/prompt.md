# Speech Therapy App Development Prompt

## Project Overview
I'm developing a speech therapy application for children that features adaptive difficulty levels, comprehensive evaluation frameworks, and engaging game mechanics to make therapy interactive and effective.

## Repository Structure
All design documents and assets are available in my GitHub repository in the `/assets` folder:
- `implementation_plan.md` - Details the adaptive difficulty system, evaluation framework, and technical implementation
- `scenario_example_multilevels.md` - Contains a complete café scenario with beginner, intermediate, and advanced difficulty levels
- `evaluation_framework.md` - Outlines the evaluation rubric and feedback system
- `engagement_mechanics.md` - Describes the rewards system, character progression, and mini-games
- `scenarios.pdf` - Contains additional static scenarios to be displayed in the app

A new folder `/assets/mini-game-assets` contains code for a Penguin Story Time mini-game that needs to be integrated into the application.

## Development Goals
Please help me improve the current version of my speech therapy app with the following enhancements:

1. **Implement Adaptive Difficulty System**
   - Create components that can display content based on difficulty level (beginner, intermediate, advanced)
   - Implement a difficulty selection mechanism that therapists can use
   - Add UI components that adapt based on the selected difficulty level

2. **Convert Scenario Markdown to JSON**
   - Parse the markdown content from `scenario_example_multilevels.md`
   - Extract all three difficulty levels (beginner, intermediate, advanced)
   - Create a structured JSON format that preserves dialogue steps, character lines, response options, quality ratings, and feedback

3. **Build Interactive Scenario Player**
   - Create a component that can play through scenario steps
   - Implement user response selection with appropriate feedback
   - Display visual supports based on the scenario requirements
   - Show appropriate feedback based on responses

4. **Implement Evaluation Framework**
   - Build a scoring system based on the 0-5 scale for speech/language and social-communication skills
   - Create visual feedback elements appropriate for children
   - Generate session summaries for therapists

5. **Integrate Mini-Game**
   - Replace the current Penguin Story Time component with the new implementation from `/assets/mini-game-assets`
   - Ensure proper integration with the rest of the application
   - Connect game progress to the overall progress tracking system

6. **Create Static Scenario Browser**
   - Display additional scenarios from the scenarios.pdf file in a browsable format
   - Allow filtering by difficulty level and targeted skills

## Technical Requirements
- Use React for the frontend implementation
- Implement responsive design for tablet use in therapy sessions
- Ensure accessibility features are properly implemented
- Use local storage for saving progress and settings in this MVP phase

## Scenario Conversion Utility
For converting the markdown scenarios to JSON, please implement a parsing utility that:
1. Extracts each difficulty level section
2. Parses the scenario structure from code blocks
3. Extracts the interactive dialogue format including prompts and responses
4. Preserves the quality ratings and feedback

Example usage pattern:
```javascript
// If using directly in the app
import { parseScenarioMarkdown } from './utils/scenarioParser';
import markdownContent from './assets/scenario_example_multilevels.md';

const scenarios = parseScenarioMarkdown(markdownContent);
// Use scenarios in the application
```

## Current Limitations to Address
- The current app doesn't adapt content based on difficulty level
- Scenarios are hardcoded rather than loaded from structured data
- The evaluation system doesn't provide comprehensive feedback
- The mini-game integration is incomplete
- Progress tracking is minimal

Please help me implement these improvements while maintaining the child-friendly and engaging nature of the application.