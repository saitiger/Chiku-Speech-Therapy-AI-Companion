# Engagement Mechanics System

## Reward System

### Points System
The points system provides consistent, measurable rewards that build toward meaningful achievements:

```json
{
  "point_structure": {
    "response_quality": {
      "excellent": 10,
      "good": 7,
      "basic": 4,
      "needs_improvement": 1
    },
    "completion_bonuses": {
      "scenario_completion": 15,
      "perfect_scenario": 25,
      "first_time_completion": 20,
      "difficulty_multipliers": {
        "beginner": 1.0,
        "intermediate": 1.5,
        "advanced": 2.0
      }
    },
    "special_achievements": {
      "sound_mastery": 50,
      "vocabulary_milestone": 50,
      "social_skill_breakthrough": 50,
      "consecutive_days": 30
    }
  }
}
```

### Visual Reward Elements

1. **Stars System**
   - 1-3 stars awarded at scenario completion
   - Requirements:
     - 1 Star: Complete scenario with any responses
     - 2 Stars: Average response quality of "Good" or better
     - 3 Stars: All "Excellent" or "Good" responses with at least 50% "Excellent"
   - Stars displayed on scenario map and achievement board

2. **Trophy Cabinet**
   - Bronze, Silver, Gold trophies for mastery levels
   - Special design trophies for unique achievements
   - Virtual display case in child's profile
   - Shareable achievements for therapy updates

3. **Level Progression**
   - Experience bar that fills with points
   - Level-up animations with special effects
   - New title/rank with each level (e.g., "Speech Explorer" → "Communication Champion")
   - Unlock message announcing new content/features

### Reward Schedule

The system uses a variable-ratio reward schedule to maintain engagement:

1. **Predictable Rewards**
   - Points for all participation
   - Stars for scenario completion
   - Daily login rewards

2. **Surprise Rewards**
   - Random bonus point multipliers
   - Unexpected character appearances
   - Special event rewards
   - "Speech superpower" temporary boosts

## Character Progression System

### Avatar Customization

Children create and evolve their avatar throughout therapy:

```json
{
  "avatar_elements": {
    "base_features": ["face_shape", "skin_tone", "eye_color", "hair_style"],
    "unlockable_items": {
      "accessories": ["glasses", "hats", "face_items"],
      "clothing": ["tops", "bottoms", "shoes", "outfits"],
      "special_items": ["communication_badges", "speech_tools", "magical_items"]
    },
    "expression_sets": ["basic", "expanded", "advanced"],
    "animation_sets": ["standard", "victory", "encouragement"]
  },
  "unlock_triggers": {
    "achievement_based": ["sound_mastery", "scenario_completion", "skill_milestone"],
    "point_thresholds": [100, 250, 500, 1000],
    "special_events": ["therapy_anniversary", "challenge_completion"]
  }
}
```

### Companion Characters

Interactive characters that provide motivation and guidance:

1. **Main Companion**
   - Evolves appearance based on child's progress
   - Provides encouragement and hints
   - Celebrates achievements
   - Personalizes interactions based on child's interests

2. **Specialist Companions**
   - Sound Master: Helps with articulation
   - Word Wizard: Supports vocabulary development
   - Social Butterfly: Guides social communication
   - Fluency Fox: Assists with speech rhythm and flow

3. **Character Relationships**
   - Memory of past interactions
   - Personalized greetings referencing achievements
   - Adaptive personalities based on child's communication style
   - Growth alongside the child's progress

### World Exploration

An engaging environment that expands with progress:

1. **Location Map**
   - Starting with limited locations (home, school, playground)
   - New locations unlock with progress (store, restaurant, library, etc.)
   - Special event locations (carnival, space station, underwater, etc.)
   - Interactive elements in each location

2. **Narrative Framework**
   - Ongoing story connecting scenarios
   - Child as the hero of their own speech journey
   - Character development tied to communication skills
   - Age-appropriate plot progression

3. **Interactive Elements**
   - Clickable objects that respond to voice
   - Hidden surprises rewarding exploration
   - Mini-games integrated into environments
   - Voice-activated features

## Mini-Games System

### Core Speech-Focused Games

1. **Sound Safari**
   - **Purpose:** Target specific speech sounds
   - **Gameplay:** Find animals/objects containing target sounds
   - **Difficulty Adaptation:** More complex sound combinations
   - **Rewards:** Sound mastery badges, animal collection

2. **Word Collector**
   - **Purpose:** Vocabulary expansion
   - **Gameplay:** Categorize words, build word chains, describe objects
   - **Difficulty Adaptation:** Basic categories → abstract concepts
   - **Rewards:** Word collection book, vocabulary badges

3. **Conversation Castle**
   - **Purpose:** Turn-taking and social skills
   - **Gameplay:** Build a castle by taking turns in conversation
   - **Difficulty Adaptation:** Simple exchanges → complex negotiations
   - **Rewards:** Castle decorations, social skills badges

4. **Fluency Flyer**
   - **Purpose:** Speech rhythm and fluency
   - **Gameplay:** Control a character's flight with smooth speech patterns
   - **Difficulty Adaptation:** Single words → full sentences → paragraphs
   - **Rewards:** New flight paths, pilot badges, vehicle upgrades

### Skill-Specific Mini-Games

1. **Emotion Express**
   - **Purpose:** Emotion recognition and appropriate responses
   - **Gameplay:** Match facial expressions to situations
   - **Difficulty Adaptation:** Basic emotions → complex emotional scenarios
   - **Rewards:** Emotion cards collection, empathy badges

2. **Grammar Galaxy**
   - **Purpose:** Sentence structure and grammar
   - **Gameplay:** Build sentences by arranging words in correct order
   - **Difficulty Adaptation:** Simple sentences → complex clauses
   - **Rewards:** Planet collection, grammar master badges

3. **Memory Mission**
   - **Purpose:** Following directions and auditory memory
   - **Gameplay:** Remember and follow multi-step instructions
   - **Difficulty Adaptation:** 1-step → 3-step → 5-step directions
   - **Rewards:** Memory power-ups, mission completion badges

4. **Question Quest**
   - **Purpose:** Asking appropriate questions
   - **Gameplay:** Gather information by asking the right questions
   - **Difficulty Adaptation:** Yes/no questions → open-ended → hypothetical
   - **Rewards:** Detective badges, mystery-solver status

### Integration with Scenarios

Mini-games are strategically integrated with scenarios for maximum therapeutic benefit:

1. **Pre-Scenario Preparation**
   - Targeted mini-games prepare child for specific sounds/skills in upcoming scenario
   - Brief 1-2 minute warm-up activities focus attention
   - Preview vocabulary or social skills needed

2. **Post-Scenario Reinforcement**
   - Games focus on skills needing practice based on scenario performance
   - Successful scenario elements celebrated through game mechanics
   - Points earned in scenarios unlock special game features

3. **Skill Transfer Bridge**
   - Games explicitly connect to real-world situations
   - "How would you use this in school?" reflection moments
   - Parent/therapist guidance on connecting game skills to everyday communication

4. **Progress-Based Unlocking**
   - New games unlock based on therapy needs and progress
   - Games adapt difficulty based on scenario performance
   - Special challenge games for skill mastery celebration

## Gamified Therapy Journey

### Child Journey Map

The child experiences their speech therapy as an epic adventure:

1. **Onboarding Experience**
   - Character creation and personalization
   - Initial "communication powers" assessment
   - Introduction to companion characters
   - First mission with guaranteed success experience

2. **Core Loop Experience**
   - Daily login rewards and greeting
   - Recommended scenarios based on goals
   - Mini-games for reinforcement
   - Progress celebration and rewards
   - Next steps preview

3. **Long-term Engagement**
   - Weekly special events
   - Monthly themed challenges
   - Achievement milestones with significant rewards
   - Visible progress journey timeline
   - "Communication Hero" story development

### Parent/Therapist Integration

The app integrates adult supervision meaningfully:

1. **Co-play Options**
   - Designated parent/therapist role in scenarios
   - Guided questions for discussion
   - Shared celebration of achievements
   - Real-world practice suggestions

2. **Progress Communication**
   - Child-friendly progress reports to share
   - "Show what I learned" demonstration features
   - Parent/therapist reward authorization for major milestones
   - Home practice activities with in-app rewards

3. **Customization Controls**
   - Therapist adjustment of reinforcement schedules
   - Focus area designation
   - Custom scenario creation tools
   - Reward sensitivity adjustments

## Technical Implementation Requirements

### Engagement Data Tracking

```json
{
  "user_metrics": {
    "session_data": {
      "frequency": "per_session",
      "metrics": ["duration", "completion_rate", "engagement_score", "response_quality_average"]
    },
    "progression_data": {
      "frequency": "daily_summary",
      "metrics": ["points_earned", "levels_gained", "achievements_unlocked", "skills_improved"]
    },
    "longitudinal_data": {
      "frequency": "weekly_summary",
      "metrics": ["retention_rate", "skill_growth_trajectory", "difficulty_progression", "trouble_areas"]
    }
  },
  "adaptive_system_triggers": {
    "engagement_interventions": {
      "low_engagement": ["companion_encouragement", "difficulty_adjustment", "reward_boost"],
      "plateaued_progress": ["new_game_introduction", "special_challenge", "alternative_approach"],
      "high_success": ["difficulty_increase", "bonus_challenges", "skill_expansion"]
    }
  }
}
```

### UI/UX Considerations

1. **Age-Appropriate Design**
   - Larger touch targets for younger users
   - Reading level adjustments by age
   - Age-appropriate themes and characters
   - Attention span considerations in activity length

2. **Accessibility Features**
   - High contrast option
   - Text-to-speech support
   - Customizable pace
   - Motor skill accommodation
   - Visual support levels

3. **Parent/Therapist Controls**
   - Professional dashboard
   - Session scheduling tools
   - Custom content creation
   - Progress reporting generation
   - Goal setting and tracking interface

### Performance Optimization

1. **Response Time**
   - Immediate feedback (< 1 second)
   - Quick loading between activities
   - Speech recognition optimization
   - Smooth animations and transitions

2. **Offline Capabilities**
   - Core functionality without internet
   - Data syncing when connection restored
   - Downloadable content packs
   - Progress caching

3. **Device Compatibility**
   - Cross-platform consistency
   - Adaptive layouts for different screens
   - Performance scaling based on device capabilities
   - Minimum specifications optimization
