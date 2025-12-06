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

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

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

