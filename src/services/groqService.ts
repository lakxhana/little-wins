// Groq API Service
// Note: In production, this should be done through a backend API to keep your API key secure

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 30000; // 30 seconds timeout

interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GroqRequest {
  model: string;
  messages: GroqMessage[];
  temperature: number;
  max_tokens: number;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

export const sendMessageToGroq = async (message: string, apiKey: string, temperature: number = 0.7): Promise<string> => {
  if (!apiKey) {
    throw new Error('Groq API key is required. Please set REACT_APP_GROQ_API_KEY in your .env file');
  }

  // Create AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const requestBody: GroqRequest = {
      model: 'llama-3.1-8b-instant', // You can change this to other Groq models
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      temperature: temperature,
      max_tokens: 1024
    };

    console.log('🌐 [Groq API] Making HTTP request to:', GROQ_API_URL);
    console.log('📤 [Groq API] Request payload:', { model: requestBody.model, messageLength: message.length });
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    console.log('📡 [Groq API] Response status:', response.status, response.statusText);

    // Clear timeout since fetch completed
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData: GroqResponse = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Groq');
    }

    const data: GroqResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    // Clear timeout in case of error
    clearTimeout(timeoutId);

    console.error('Groq API Error:', error);
    
    // Handle abort/timeout error
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.name === 'DOMException') {
        throw new Error('Request timeout: The Groq API request took too long to respond. Please try again.');
      }
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

interface TaskAnalysis {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time: string;
  xpReward: number;
  adhdTips: string[];
}

export const analyzeTaskWithGroq = async (
  taskText: string,
  energyLevel: string | null,
  taskFeeling: string | null,
  apiKey: string
): Promise<TaskAnalysis> => {
  if (!apiKey) {
    throw new Error('Groq API key is required. Please set REACT_APP_GROQ_API_KEY in your .env file');
  }

  // Build comprehensive context
  let contextParts = [];
  if (energyLevel) {
    const energyDescriptions = {
      low: 'low energy (needs simple, manageable tasks)',
      moderate: 'moderate energy (can handle regular tasks)',
      high: 'high energy (ready for challenges)'
    };
    contextParts.push(`Energy level: ${energyDescriptions[energyLevel as keyof typeof energyDescriptions] || energyLevel}`);
  }
  if (taskFeeling) {
    const feelingDescriptions = {
      overwhelmed: 'feeling overwhelmed (needs help managing the load)',
      structure: 'needs help with structure and organization'
    };
    contextParts.push(`Current state: ${feelingDescriptions[taskFeeling as keyof typeof feelingDescriptions] || taskFeeling}`);
  }
  const context = contextParts.length > 0 ? `\n\nUser Context:\n${contextParts.join('\n')}` : '';
  
  // Safety check: If the task contains concerning content, respond with care
  // Use word boundaries for single words to avoid false positives
  const lowerTaskText = taskText.toLowerCase();
  const wordBoundaryCheck = (word: string) => {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(lowerTaskText);
  };
  
  const hasConcerningContent = 
    wordBoundaryCheck('suicide') || 
    wordBoundaryCheck('kill') || 
    wordBoundaryCheck('murder') ||
    lowerTaskText.includes('end my life') ||
    wordBoundaryCheck('hurt') ||
    lowerTaskText.includes('self harm') ||
    lowerTaskText.includes('want to die') ||
    wordBoundaryCheck('violence') ||
    wordBoundaryCheck('attack') ||
    wordBoundaryCheck('assault') ||
    wordBoundaryCheck('hang') ||
    wordBoundaryCheck('die') ||
    wordBoundaryCheck('death') ||
    wordBoundaryCheck('dying') ||
    wordBoundaryCheck('dead') ||
    wordBoundaryCheck('drug') ||
    wordBoundaryCheck('overdose') ||
    wordBoundaryCheck('smoking') ||
    wordBoundaryCheck('nicotine') ||
    wordBoundaryCheck('addiction') ||
    wordBoundaryCheck('alcohol');

  if (hasConcerningContent) {
    // Don't analyze concerning content as a task
    // Return a response that encourages seeking help
    throw new Error('SAFETY_CONCERN');
  }

  const prompt = `Analyze the following task and provide a structured analysis. Consider the task complexity, estimated time, and provide ADHD-friendly tips. IMPORTANTLY: Adjust your analysis based on the user's current energy level and emotional state.

CRITICAL SAFETY NOTE: If the task text contains any references to self-harm, suicide, or wanting to die, DO NOT analyze it as a task. Instead, respond with a message expressing concern and encouraging the user to seek help. However, in this case, the safety check should have caught it before reaching this point.

Task: "${taskText}"${context}

Please analyze this task and respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks, just the raw JSON):
{
  "difficulty": "Easy" | "Medium" | "Hard",
  "time": "5m" | "10m" | "15m" | "20m" | "30m" | "45m" | "1h",
  "xpReward": 10 | 15 | 20 | 25 | 30,
  "adhdTips": ["tip 1", "tip 2"]
}

Guidelines:
- Difficulty: Adjust based on user's energy and state. If user has low energy or is overwhelmed, consider breaking complex tasks into easier chunks. "Easy" for simple tasks (1-5 steps), "Medium" for moderate tasks (6-15 steps), "Hard" for complex tasks (16+ steps or multiple components)
- Time: Estimate realistic completion time considering user's energy level. If low energy, tasks may take longer. If high energy, they may be faster.
- XP Reward: 10 for Easy, 20 for Medium, 30 for Hard. Adjust slightly based on user's state (e.g., if overwhelmed but completing a task, reward appropriately)
- ADHD Tips: Provide exactly 2 SHORT, concise tips (max 6-8 words each). Tips must be brief and scannable for neurodivergent users. Be direct and actionable. Tailor tips to user's current state:
  * If overwhelmed: focus on calming, breaking down, starting small
  * If low energy: focus on simple steps, rest, pacing
  * If needs structure: focus on organization, planning, systems
  Examples: "Set timer", "Break it down", "Start small", "Use Pomodoro", "One step at a time", "Take breaks", "Breathe first", "Start with 5 mins"

Respond with ONLY the JSON object, nothing else.`;

  try {
    console.log('🤖 [Groq API] Sending task analysis request...');
    const response = await sendMessageToGroq(prompt, apiKey);
    console.log('✅ [Groq API] Received analysis response');
    
    // Parse the JSON response
    // Remove any markdown code blocks if present
    let jsonString = response.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/```\n?/g, '');
    }
    
    const analysis: TaskAnalysis = JSON.parse(jsonString);
    
    // Validate and set defaults if needed
    if (!['Easy', 'Medium', 'Hard'].includes(analysis.difficulty)) {
      analysis.difficulty = 'Easy';
    }
    if (!analysis.time) {
      analysis.time = '5m';
    }
    if (!analysis.xpReward || analysis.xpReward < 10) {
      analysis.xpReward = 10;
    }
    if (!Array.isArray(analysis.adhdTips) || analysis.adhdTips.length === 0) {
      analysis.adhdTips = ['Set timer', 'Break it down'];
    }
    // Ensure exactly 2 tips
    analysis.adhdTips = analysis.adhdTips.slice(0, 2);
    
    return analysis;
  } catch (error) {
    console.error('Task analysis error:', error);
    throw error;
  }
};

export interface TaskBreakdownStep {
  step: string;
  isBreak?: boolean;
}

export const breakDownTaskWithGroq = async (
  taskText: string,
  energyLevel: string | null,
  taskFeeling: string | null,
  apiKey: string
): Promise<TaskBreakdownStep[]> => {
  if (!apiKey) {
    throw new Error('Groq API key is required. Please set REACT_APP_GROQ_API_KEY in your .env file');
  }

  // Build comprehensive context
  let contextParts = [];
  if (energyLevel) {
    const energyDescriptions = {
      low: 'low energy (needs very simple, small steps)',
      moderate: 'moderate energy (can handle regular steps)',
      high: 'high energy (can handle more complex steps)'
    };
    contextParts.push(`Energy: ${energyDescriptions[energyLevel as keyof typeof energyDescriptions] || energyLevel}`);
  }
  if (taskFeeling) {
    const feelingDescriptions = {
      overwhelmed: 'feeling overwhelmed (needs extra breaks, smaller steps)',
      structure: 'needs structure (organize steps clearly)'
    };
    contextParts.push(`State: ${feelingDescriptions[taskFeeling as keyof typeof feelingDescriptions] || taskFeeling}`);
  }
  const context = contextParts.length > 0 ? `\n\nUser Context:\n${contextParts.join('\n')}\n\nIMPORTANT: Adjust breakdown based on this context. If overwhelmed or low energy, make steps smaller and add more breaks.` : '';
  
  const prompt = `Break down the following task into 3-4 logical, meaningful work steps plus 1-2 breaks (5 steps total maximum). This is for someone with ADHD/neurodivergent needs.${context}

Task: "${taskText}"

IMPORTANT RULES:
- Focus on the ACTUAL WORK that needs to be done, NOT preparation steps
- DO NOT include steps like "put on clothes", "get water", "gather supplies" - these are not part of the task
- Break down into logical areas/sections (e.g., for "clean my house" → "Clean kitchen", "Clean bathroom", "Clean living room")
- Each step should be a meaningful chunk of work, not micro-actions
- Maximum 5 steps total (3-4 work steps + 1-2 breaks)
- Include 1-2 breaks strategically placed between work steps

Respond with ONLY a valid JSON array in this exact format (no markdown, no code blocks, just the raw JSON):
[
  {"step": "First meaningful work step", "isBreak": false},
  {"step": "BREAK - Walk around for 5 mins", "isBreak": true},
  {"step": "Second meaningful work step", "isBreak": false},
  ...
]

Guidelines:
- MAXIMUM 5 steps total (work steps + breaks combined)
- Steps should be LOGICAL and MEANINGFUL, not overly granular
- For cleaning tasks: break by room/area (e.g., "Clean kitchen", "Clean bathroom")
- For work tasks: break by logical sections (e.g., "Research phase", "Writing phase", "Review phase")
- For application tasks: break by form sections (e.g., "Personal info section", "Work history section")
- DO NOT include preparation steps like getting ready, gathering supplies, etc.
- Include 1-2 breaks strategically placed (every 2-3 work steps)
- Break steps should be restorative: "BREAK - Walk around for 5 mins", "BREAK - Snack + stretch", "BREAK - Deep breath and reset"

Examples of GOOD breakdowns:
Task: "clean my house"
→ ["Clean kitchen", "Clean bathroom", "BREAK - Walk around for 5 mins", "Clean living room", "Clean bedroom"]

Task: "apply for a job"
→ ["Research company and role", "Update resume", "BREAK - Stretch and reset", "Write cover letter", "Submit application"]

Task: "organize my files"
→ ["Sort documents by category", "BREAK - Walk around for 5 mins", "File important documents", "Shred or recycle old papers"]

Examples of BAD breakdowns (too granular):
Task: "clean my house"
→ ["Put on comfortable clothes", "Get a glass of water", "Go to kitchen", "Open trash can"] ❌ TOO GRANULAR

Respond with ONLY the JSON array, nothing else.`;

  try {
    console.log('🤖 [Groq API] Sending task breakdown request...');
    const response = await sendMessageToGroq(prompt, apiKey);
    console.log('✅ [Groq API] Received breakdown response:', response.substring(0, 200));
    
    // Parse the JSON response - try multiple strategies
    let jsonString = response.trim();
    
    // Remove markdown code blocks if present
    if (jsonString.includes('```')) {
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    // Try to extract JSON array if there's extra text
    const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
    
    jsonString = jsonString.trim();
    
    console.log('🔍 [Groq API] Extracted JSON string:', jsonString.substring(0, 200));
    
    let steps: TaskBreakdownStep[];
    try {
      steps = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('❌ [Groq API] JSON parse error:', parseError);
      console.error('❌ [Groq API] Raw response:', response);
      throw new Error(`Failed to parse AI response as JSON. The AI may have returned invalid format. Please try again.`);
    }
    
    // Validate steps
    if (!Array.isArray(steps)) {
      console.error('❌ [Groq API] Response is not an array:', steps);
      throw new Error('AI returned invalid format: expected an array of steps');
    }
    
    if (steps.length === 0) {
      console.warn('⚠️ [Groq API] Empty steps array received');
      throw new Error('AI returned no steps. Please try again.');
    }
    
    // Ensure all steps have required fields
    steps = steps.map((step, index) => {
      if (!step || typeof step !== 'object') {
        console.warn(`⚠️ [Groq API] Invalid step at index ${index}:`, step);
        return { step: String(step || ''), isBreak: false };
      }
      return {
        step: step.step || String(step) || '',
        isBreak: step.isBreak || false
      };
    }).filter(step => step.step.trim().length > 0); // Remove empty steps
    
    if (steps.length === 0) {
      throw new Error('All steps were empty. Please try again.');
    }

    // Limit to maximum 5 steps for neurodivergent users (to prevent overwhelm)
    if (steps.length > 5) {
      // Keep breaks and prioritize first work steps
      const breaks = steps.filter(s => s.isBreak);
      const workSteps = steps.filter(s => !s.isBreak);
      // Take first 3-4 work steps and 1-2 breaks to total 5
      const maxWorkSteps = 5 - Math.min(breaks.length, 2);
      steps = [...workSteps.slice(0, maxWorkSteps), ...breaks.slice(0, 2)].slice(0, 5);
    }

    console.log('✅ [Groq API] Final steps:', steps);
    return steps;
  } catch (error) {
    console.error('❌ [Groq API] Task breakdown error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during task breakdown');
  }
};

// Use AI to check if a step contains multiple sub-tasks and needs breakdown
const checkIfStepNeedsBreakdown = async (
  stepText: string,
  apiKey: string
): Promise<boolean> => {
  const prompt = `Analyze this step and determine if it contains multiple sub-tasks that should be broken down further.

Step: "${stepText}"

Does this step mention multiple things that should be separate steps? For example:
- "planning accommodations, transportation, and activities" → YES (has multiple items)
- "organize files and clean desk" → YES (has "and" with multiple actions)
- "Fill out basic info" → NO (single action)
- "Write cover letter" → NO (single action)

Respond with ONLY "true" or "false" (no quotes, no explanation, just the word).`;

  try {
    const response = await sendMessageToGroq(prompt, apiKey);
    const trimmed = response.trim().toLowerCase();
    return trimmed === 'true' || trimmed === 'yes';
  } catch (error) {
    console.error('Failed to check if step needs breakdown:', error);
    return false;
  }
};

// Helper function to break down a single step that contains multiple sub-tasks
const breakDownStepWithGroq = async (
  stepText: string,
  apiKey: string
): Promise<TaskBreakdownStep[]> => {
  const prompt = `This step contains multiple sub-tasks. Break it down into individual, atomic steps. Each step should do ONE thing only.

Step: "${stepText}"

Break this down into separate steps. If it mentions multiple things (like "planning accommodations, transportation, and activities"), create separate steps for each.

Respond with ONLY a valid JSON array in this exact format (no markdown, no code blocks, just the raw JSON):
[
  {"step": "First sub-step", "isBreak": false},
  {"step": "Second sub-step", "isBreak": false},
  ...
]

Guidelines:
- Each step must be a SINGLE action
- No breaks needed (these are sub-steps)
- Keep steps very specific and actionable
- Maximum 3 sub-steps (to keep total manageable)

Respond with ONLY the JSON array, nothing else.`;

  try {
    const response = await sendMessageToGroq(prompt, apiKey);
    
    let jsonString = response.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/```\n?/g, '');
    }
    
    const subSteps: TaskBreakdownStep[] = JSON.parse(jsonString);
    
    if (!Array.isArray(subSteps) || subSteps.length === 0) {
      return [{ step: stepText, isBreak: false }];
    }
    
    // Limit sub-steps to 3 maximum
    const limitedSubSteps = subSteps.slice(0, 3).map(step => ({
      step: step.step || stepText,
      isBreak: false // Sub-steps don't need breaks
    }));
    
    return limitedSubSteps;
  } catch (error) {
    console.error('Step breakdown error:', error);
    return [{ step: stepText, isBreak: false }];
  }
};

/**
 * Generate a short, simple, and encouraging motivational quote for neurodivergent users
 */
export const generateMotivationalQuote = async (
  apiKey: string,
  taskFeeling?: string | null,
  energyLevel?: string | null
): Promise<string> => {
  let context = '';
  if (taskFeeling || energyLevel) {
    const parts = [];
    if (taskFeeling === 'overwhelmed') parts.push('feeling overwhelmed');
    if (energyLevel === 'low') parts.push('low energy');
    if (parts.length > 0) {
      context = `\n\nUser Context: The person is ${parts.join(' and ')}. Tailor the quote to be especially supportive and understanding of this state.`;
    }
  }
  
  const prompt = `Generate a short, simple, and encouraging motivational quote for someone with ADHD or other neurodivergent conditions.${context}

CRITICAL: You MUST respond with ONLY ONE SENTENCE. Maximum 15 words. Do NOT write multiple sentences or paragraphs. This is for neurodivergent users who can be overwhelmed by too much text.

IMPORTANT: Generate a DIFFERENT and UNIQUE quote each time. Do NOT repeat previous quotes. Be creative and vary your wording, themes, and approaches.

CRITICAL REQUIREMENTS:
- ONE SENTENCE ONLY (maximum 12-15 words, never more)
- Keep it SIMPLE and straightforward
- Make it encouraging and supportive
- Avoid complex metaphors or abstract concepts
- Use direct, clear language
- Focus on progress, small wins, or self-compassion
- Be warm and understanding
- VARY your quotes - use different themes, wording, and perspectives each time
- NO multiple sentences, NO paragraphs, NO lists

Examples of GOOD quotes (ONE sentence each, use as inspiration but create NEW ones):
- "Small steps forward are still progress. You've got this!"
- "Every completed task is a victory, no matter how small."
- "Your pace is perfect. Keep moving forward."
- "Breaking things down isn't weakness, it's wisdom."
- "Today's small win is tomorrow's foundation."
- "You don't have to be perfect, just keep going."
- "Rest is valid. You're doing enough."
- "Progress, not perfection, is the goal."
- "You're doing better than you think."
- "One task at a time is enough."
- "Your effort matters, even when it feels small."
- "It's okay to take breaks. You're human."

Examples of BAD responses (DO NOT DO THIS):
- Multiple sentences: "You've made it through today, and tomorrow is a new chance. Every task done is a step closer."
- Paragraphs: "Your effort counts, no matter how it looks right now. Take a breath, and start again with kindness."
- Too long: "In the journey of a thousand miles, the first step is the most important, and remember that every journey is unique."

Respond with ONLY ONE SENTENCE (12-15 words maximum). No quotes, no explanation, just the single sentence quote itself.`;

  try {
    console.log('🤖 AI: Generating motivational quote with Groq AI...');
    // Use higher temperature (0.9) for more variety in quotes
    const response = await sendMessageToGroq(prompt, apiKey, 0.9);
    let quote = response.trim();
    
    // Remove any surrounding quotes if present
    quote = quote.replace(/^["']|["']$/g, '');
    
    // Ensure it's only one sentence - take the first sentence if multiple
    const sentences = quote.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 0) {
      quote = sentences[0].trim();
      // Add period if it doesn't end with punctuation
      if (!/[.!?]$/.test(quote)) {
        quote += '.';
      }
    }
    
    // Limit to reasonable length (max 100 characters to ensure it's one sentence)
    if (quote.length > 100) {
      // Take first sentence or truncate at last complete word before 100 chars
      const truncated = quote.substring(0, 100);
      const lastSpace = truncated.lastIndexOf(' ');
      quote = truncated.substring(0, lastSpace > 0 ? lastSpace : 100).trim() + '.';
    }
    
    console.log('✅ AI: Motivational quote generated', { quote });
    return quote || "Small steps forward are still progress. You've got this!";
  } catch (error) {
    console.error('Failed to generate motivational quote:', error);
    // Return a simple fallback
    return "Small steps forward are still progress. You've got this!";
  }
};

