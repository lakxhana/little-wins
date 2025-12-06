// Groq API Service
// Note: In production, this should be done through a backend API to keep your API key secure

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData: GroqResponse = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Groq');
    }

    const data: GroqResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Groq API Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

