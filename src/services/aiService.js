import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const DEFAULT_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'gemini';

let geminiClient = null;
let openaiClient = null;

if (GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

if (OPENAI_API_KEY) {
  openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
}

export const aiService = {
  async generateTripItinerary(tripData) {
    const { from, destination, travelers, tripType, date, budget, mode } = tripData;
    
    const prompt = `Create a detailed 3-day travel itinerary for a ${tripType || 'leisure'} trip:
    
From: ${from}
To: ${destination}
Number of travelers: ${travelers}
Travel date: ${date}
Budget: ${budget ? `₹${budget}` : 'Flexible'}
Travel mode: ${mode}

Please provide:
1. Day-by-day itinerary with morning, afternoon, and evening activities
2. Restaurant recommendations for each day
3. Must-visit attractions
4. Estimated costs for activities
5. Local tips and cultural etiquette

Format the response as a detailed travel guide.`;

    try {
      if (DEFAULT_PROVIDER === 'openai' && openaiClient) {
        return await this.generateWithOpenAI(prompt);
      } else if (geminiClient) {
        return await this.generateWithGemini(prompt);
      } else {
        throw new Error('No AI provider configured. Please set VITE_GEMINI_API_KEY or VITE_OPENAI_API_KEY in your .env file.');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  },

  async generateWithGemini(prompt) {
    if (!geminiClient) {
      throw new Error('Gemini API key not configured');
    }

    const response = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return {
      success: true,
      provider: 'gemini',
      content: response.text,
    };
  },

  async generateWithOpenAI(prompt) {
    if (!openaiClient) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await openaiClient.responses.create({
      model: 'gpt-5.2',
      reasoning: { effort: 'low' },
      input: prompt,
    });

    return {
      success: true,
      provider: 'openai',
      content: response.output_text,
    };
  },

  async getDestinationInfo(destination) {
    const prompt = `Provide comprehensive travel information about ${destination}:

1. Best time to visit
2. Top 5 attractions
3. Local cuisine and must-try dishes
4. Cultural customs and etiquette
5. Safety tips
6. Transportation options
7. Average costs

Keep the response concise but informative.`;

    try {
      if (DEFAULT_PROVIDER === 'openai' && openaiClient) {
        return await this.generateWithOpenAI(prompt);
      } else if (geminiClient) {
        return await this.generateWithGemini(prompt);
      }
    } catch (error) {
      console.error('Error getting destination info:', error);
      throw error;
    }
  },
};
