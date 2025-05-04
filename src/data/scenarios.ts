import { Scenario, ScenarioDetails } from "@/types";

// Main scenario cards for homepage selection
export const scenarios: Scenario[] = [
  {
    id: "greetings",
    title: "Friendly Greetings",
    description: "Practice saying hello and introducing yourself to new friends!",
    iconName: "👋",
    backgroundClass: "bg-gradient-to-br from-speech-yellow to-speech-pink",
  },
  {
    id: "storytelling",
    title: "Story Time",
    description: "Look at the picture and tell a story about what you see!",
    iconName: "📚",
    backgroundClass: "bg-gradient-to-br from-speech-blue to-speech-purple",
  },
  {
    id: "feelings",
    title: "Sharing Feelings",
    description: "Learn how to talk about your feelings when something happens.",
    iconName: "😊",
    backgroundClass: "bg-gradient-to-br from-speech-green to-speech-blue",
  },
  {
    id: "cafe",
    title: "Ordering at Cafe",
    description: "Practice ordering your favorite drink at a café and handling different situations.",
    iconName: "☕",
    backgroundClass: "bg-gradient-to-br from-speech-orange to-speech-yellow",
  }
];

// Character definitions
const characters = {
  stella: {
    name: "Stella",
    imageUrl: "/stella.png", // We'll create this placeholder
  },
  orion: {
    name: "Orion",
    imageUrl: "/orion.png", // We'll create this placeholder
  },
  nova: {
    name: "Nova",
    imageUrl: "/nova.png", // We'll create this placeholder
  },
  barista: {
    name: "Barista",
    imageUrl: "/stella.png", // Using Stella as the barista character for now
  }
};

// Detailed scenario information
export const scenarioDetails: Record<string, ScenarioDetails> = {
  "greetings": {
    id: "greetings",
    title: "Friendly Greetings",
    instruction: "Imagine you're meeting a new friend at school. What would you say to introduce yourself?",
    prompt: "Hi there! I'm new to your class. Can you tell me your name and something you like to do?",
    character: characters.stella,
  },
  "storytelling": {
    id: "storytelling",
    title: "Story Time",
    instruction: "Look at the picture below and tell a short story about what you see. Who are the characters? What are they doing?",
    prompt: "What's happening in this picture? Tell me a story about it!",
    imageUrl: "/story-image.png", // We'll create this placeholder
    character: characters.orion,
  },
  "feelings": {
    id: "feelings",
    title: "Sharing Feelings",
    instruction: "Imagine you feel sad because someone didn't want to play with you at recess. How would you tell a teacher or friend how you feel?",
    prompt: "How would you tell someone about your feelings in this situation?",
    character: characters.nova,
  },
  "cafe": {
    id: "cafe",
    title: "Ordering at Cafe",
    instruction: "You're at a café counter. The barista is ready to take your order. Practice ordering a drink and handling different situations.",
    prompt: "What would you like to order at the café?",
    character: characters.barista,
    useDemo: true, // Flag to indicate this scenario should use the demo content
  }
};

// Example user responses for simulation
export const sampleResponses: Record<string, string[]> = {
  "greetings": [
    "Hi, my name is Alex and I like to play soccer!",
    "Hello, I'm Jamie. I enjoy reading books and drawing pictures.",
    "Hi there! I'm Casey. I like to build things with Legos and play with my dog."
  ],
  "storytelling": [
    "I see two kids at the park. They are playing on the swings and having fun together. The sun is shining and they look happy.",
    "There's a girl and a boy in the picture. They found a lost puppy in the park. They're trying to find its owner by looking at its collar.",
    "The picture shows a family having a picnic. The mom and dad are setting up food while the kids are playing with a ball. They brought their pet dog too!"
  ],
  "feelings": [
    "I feel sad because I wanted to play with them. I would tell my teacher that my feelings were hurt when they said no.",
    "I would say I'm feeling a little upset because I wanted to join in the game. Could you help me find someone to play with?",
    "I feel disappointed that they didn't want to play with me. I would tell my friend that it made me feel lonely and ask if they want to play something together instead."
  ],
  "cafe": [
    "I would like a small hot chocolate, please.",
    "Yes, please. I love whipped cream on hot chocolate.",
    "Excuse me, there seems to be a mix-up. I ordered a hot chocolate with whipped cream, not coffee."
  ]
};
