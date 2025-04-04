// src/services/chatbotService.ts
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Add more detailed error handling and logging
export const sendMessageToGemini = async (messages: ChatMessage[]): Promise<string> => {
  try {
    // Check if API key is configured - Using Vite environment variable format
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.");
      return "Configuration error: API key is missing. Please check your setup.";
    }
    
    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
    
    // API call to Gemini (adjust URL and parameters based on actual Gemini API)
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });
    
    // Check if response is OK
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Gemini API error:", response.status, errorData);
      
      if (response.status === 401 || response.status === 403) {
        return "Authentication error: Please check your API key.";
      } else if (response.status === 429) {
        return "Rate limit exceeded: Too many requests to the AI service.";
      } else {
        return `API error (${response.status}): Unable to get a response from the AI service.`;
      }
    }
    
    // Parse successful response
    const data = await response.json();
    
    // Handle empty response
    if (!data.candidates || data.candidates.length === 0) {
      console.error("Empty response from Gemini API:", data);
      return "The AI service returned an empty response. Please try again.";
    }
    
    // Extract the message content
    return data.candidates[0].content.parts[0].text || "I don't have a response for that.";
    
  } catch (error) {
    // Log the actual error for debugging
    console.error("Error in sendMessageToGemini:", error);
    
    // Check for network errors
    if (error instanceof TypeError && error.message.includes('network')) {
      return "Network error: Unable to connect to the AI service. Please check your internet connection.";
    }
    
    // Generic error message
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
};