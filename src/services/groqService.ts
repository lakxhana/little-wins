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

export const sendMessageToGroq = async (message: string, apiKey: string): Promise<string> => {
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
      temperature: 0.7,
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
  apiKey: string
): Promise<TaskAnalysis> => {
  if (!apiKey) {
    throw new Error('Groq API key is required. Please set REACT_APP_GROQ_API_KEY in your .env file');
  }

  const energyContext = energyLevel ? `The user's current energy level is: ${energyLevel}.` : '';
  
  const prompt = `Analyze the following task and provide a structured analysis. Consider the task complexity, estimated time, and provide ADHD-friendly tips.

Task: "${taskText}"
${energyContext}

Please analyze this task and respond with ONLY a valid JSON object in this exact format (no markdown, no code blocks, just the raw JSON):
{
  "difficulty": "Easy" | "Medium" | "Hard",
  "time": "5m" | "10m" | "15m" | "20m" | "30m" | "45m" | "1h",
  "xpReward": 10 | 15 | 20 | 25 | 30,
  "adhdTips": ["tip 1", "tip 2"]
}

Guidelines:
- Difficulty: "Easy" for simple tasks (1-5 steps), "Medium" for moderate tasks (6-15 steps), "Hard" for complex tasks (16+ steps or multiple components)
- Time: Estimate realistic completion time in minutes (m) or hours (h)
- XP Reward: 10 for Easy, 20 for Medium, 30 for Hard
- ADHD Tips: Provide exactly 2 SHORT, concise tips (max 6-8 words each). Tips must be brief and scannable for neurodivergent users. Be direct and actionable. Examples: "Set timer", "Break it down", "Start small", "Use Pomodoro", "One step at a time", "Take breaks"

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
  apiKey: string
): Promise<TaskBreakdownStep[]> => {
  if (!apiKey) {
    throw new Error('Groq API key is required. Please set REACT_APP_GROQ_API_KEY in your .env file');
  }

  const energyContext = energyLevel ? `The user's current energy level is: ${energyLevel}.` : '';
  
  const prompt = `Break down the following task into smaller, manageable steps. This is for someone with ADHD/neurodivergent needs, so keep it simple and avoid overwhelm.

Task: "${taskText}"
${energyContext}

Break this task down into EXACTLY 5 steps maximum (including breaks). This is critical - neurodivergent people get overwhelmed with too many tasks. Include 1-2 strategic breaks placed between work steps. Breaks should be short (3-5 minutes) and restorative.

CRITICAL: 
- Maximum 5 steps total (work steps + breaks combined)
- Each step must be a SINGLE, atomic action
- If a step mentions multiple things (like "planning accommodations, transportation, and activities"), break it into separate steps
- Each step should do ONE thing only
- Keep it concise - 5 steps is the limit to prevent overwhelm

Respond with ONLY a valid JSON array in this exact format (no markdown, no code blocks, just the raw JSON):
[
  {"step": "First actionable step", "isBreak": false},
  {"step": "Second actionable step", "isBreak": false},
  {"step": "BREAK - Walk around for 5 mins", "isBreak": true},
  {"step": "Third actionable step", "isBreak": false},
  ...
]

Guidelines:
- MAXIMUM 5 steps total (work steps + breaks combined) - this is critical for neurodivergent users
- Steps must be ATOMIC - one action per step. Never combine multiple tasks in one step.
- If you see phrases like "planning X, Y, and Z" or "organize A and B", split into separate steps.
- Steps should be very specific and actionable (e.g., "Fill out basic info ONLY (15 mins)" not "Fill out form")
- Include 1-2 breaks strategically placed (every 2-3 work steps)
- Break steps should be restorative: "BREAK - Walk around for 5 mins", "BREAK - Snack + stretch", "BREAK - Deep breath and reset"
- Make steps small enough to feel achievable
- Use time estimates in parentheses when helpful (e.g., "Write cover letter draft (use template!) (20 mins)")
- Prioritize the most important steps - if the task has many parts, focus on the 3-4 most critical work steps plus 1-2 breaks

Examples of GOOD steps:
- "Find application link and save it" (single action)
- "Gather documents (CV, transcript, portfolio)" (one gathering action)
- "Fill out basic info ONLY (15 mins)" (one form section)

Examples of BAD steps (split these):
- "Plan accommodations, transportation, and activities" → Split into: "Research accommodations", "Book transportation", "Plan activities"
- "Organize files and clean desk" → Split into: "Organize files", "Clean desk"

Respond with ONLY the JSON array, nothing else.`;

  try {
    console.log('🤖 [Groq API] Sending task breakdown request...');
    const response = await sendMessageToGroq(prompt, apiKey);
    console.log('✅ [Groq API] Received breakdown response');
    
    // Parse the JSON response
    let jsonString = response.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/```\n?/g, '');
    }
    
    let steps: TaskBreakdownStep[] = JSON.parse(jsonString);
    
    // Validate steps
    if (!Array.isArray(steps) || steps.length === 0) {
      throw new Error('Invalid breakdown format');
    }
    
    // Ensure all steps have required fields
    steps = steps.map(step => ({
      step: step.step || '',
      isBreak: step.isBreak || false
    }));

    // Limit to maximum 5 steps for neurodivergent users (to prevent overwhelm)
    if (steps.length > 5) {
      // Keep breaks and prioritize first work steps
      const breaks = steps.filter(s => s.isBreak);
      const workSteps = steps.filter(s => !s.isBreak);
      // Take first 3-4 work steps and 1-2 breaks to total 5
      const maxWorkSteps = 5 - Math.min(breaks.length, 2);
      steps = [...workSteps.slice(0, maxWorkSteps), ...breaks.slice(0, 2)].slice(0, 5);
    }

    // Use AI to check and break down any steps that contain multiple sub-tasks
    const expandedSteps: TaskBreakdownStep[] = [];
    for (const stepItem of steps) {
      if (stepItem.isBreak) {
        expandedSteps.push(stepItem);
        continue;
      }

      // Use AI to determine if this step needs further breakdown
      try {
        const needsBreakdown = await checkIfStepNeedsBreakdown(stepItem.step, apiKey);
        if (needsBreakdown) {
          const subSteps = await breakDownStepWithGroq(stepItem.step, apiKey);
          expandedSteps.push(...subSteps);
        } else {
          expandedSteps.push(stepItem);
        }
      } catch (error) {
        console.error('Failed to check/break down step:', error);
        // If breakdown fails, keep original step
        expandedSteps.push(stepItem);
      }
    }
    
    // Final limit: Maximum 5 steps total for neurodivergent users (to prevent overwhelm)
    // Preserve original order when limiting
    if (expandedSteps.length > 5) {
      // Simply take the first 5 steps to preserve order
      return expandedSteps.slice(0, 5);
    }
    
    return expandedSteps;
  } catch (error) {
    console.error('Task breakdown error:', error);
    throw error;
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

