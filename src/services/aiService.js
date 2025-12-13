import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Users can add their API key via environment variable VITE_GEMINI_API_KEY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export const aiService = {
  // Generate AI-powered trip suggestions
  async generateTripSuggestions(tripData) {
    // If no API key, return mock data
    if (!genAI) {
      return getMockSuggestions(tripData);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `You are a travel expert AI. Based on the following trip details, provide personalized travel suggestions:
      
Trip Details:
- Name: ${tripData.name}
- From: ${tripData.from}
- Destination: ${tripData.destination}
- Date: ${tripData.date}
- Budget: ${tripData.budget || 'Not specified'}
- Travel Mode: ${tripData.mode}
- Number of Travelers: ${tripData.travelers}
- Trip Type: ${tripData.tripType}

Please provide:
1. Top 3 must-visit attractions in ${tripData.destination}
2. Best local food recommendations
3. Travel tips specific to this destination
4. Estimated costs breakdown
5. Best time to visit recommendations

Format the response in a clear, concise manner.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        success: true,
        suggestions: text,
        source: 'gemini-ai'
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return getMockSuggestions(tripData);
    }
  },

  // Generate local guide information
  async generateLocalGuide(city) {
    if (!genAI) {
      return getMockGuide(city);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `Provide a comprehensive local guide for ${city}. Include:
      
1. Top attractions and landmarks
2. Local cuisine and recommended restaurants
3. Cultural tips and etiquette
4. Transportation options
5. Emergency contacts
6. Best neighborhoods to explore
7. Hidden gems tourists might miss

Format the response in a structured, easy-to-read manner.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        success: true,
        guide: text,
        source: 'gemini-ai'
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return getMockGuide(city);
    }
  },

  // Generate detailed booking information with AI
  async generateBookingDetails(booking) {
    if (!genAI) {
      return getMockBookingDetails(booking);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `You are a travel expert AI. Generate detailed travel suggestions for this confirmed booking:

Trip Details:
- Destination: ${booking.tripData.destination}
- From: ${booking.tripData.from}
- Date: ${booking.tripData.date}
- Travelers: ${booking.tripData.travelers} (${booking.tripData.tripType} trip)
- Travel Mode: ${booking.travel.name}
- Hotel: ${booking.hotel.name}

Please provide:
1. Best attractions to visit in ${booking.tripData.destination}
2. Local food and dining recommendations
3. Day-by-day itinerary suggestions
4. Cultural tips and local customs
5. Shopping recommendations
6. Photography spots
7. Best time to visit attractions
8. Local transportation tips

Format the response in a clear, organized manner.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        success: true,
        suggestions: text,
        source: 'gemini-ai'
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return getMockBookingDetails(booking);
    }
  },

  // Check if AI is available
  isAIAvailable() {
    return !!genAI;
  }
};

// Mock data for when AI is not available
function getMockSuggestions(tripData) {
  return {
    success: true,
    suggestions: `AI-Powered Trip Suggestions for ${tripData.destination}:

🏛️ Top Attractions:
1. Historic landmarks and cultural sites
2. Natural wonders and scenic viewpoints
3. Local markets and shopping districts

🍽️ Food Recommendations:
- Try local specialties and street food
- Visit popular restaurants in the city center
- Don't miss traditional breakfast spots

💡 Travel Tips:
- Best time to visit is during spring or fall
- Book accommodations in advance
- Use local transportation for authentic experience
- Respect local customs and traditions

💰 Budget Estimate:
- Accommodation: ₹${parseInt(tripData.budget) * 0.4 || 3000}/night
- Food: ₹${parseInt(tripData.budget) * 0.3 || 1500}/day
- Activities: ₹${parseInt(tripData.budget) * 0.3 || 2000}/day

Note: Add VITE_GEMINI_API_KEY to .env for real AI-powered suggestions!`,
    source: 'mock'
  };
}

function getMockGuide(city) {
  return {
    success: true,
    guide: `Local Guide for ${city}:

🏛️ Must-Visit Attractions:
- Historic monuments and museums
- Scenic parks and gardens
- Cultural centers and galleries

🍽️ Local Cuisine:
- Traditional dishes to try
- Popular restaurants
- Street food recommendations

🚗 Transportation:
- Public transit options
- Ride-sharing services
- Local taxi information

⚠️ Emergency Contacts:
- Police: 100
- Ambulance: 108
- Tourist Helpline: Available 24/7

Note: Add VITE_GEMINI_API_KEY to .env for detailed AI-generated guides!`,
    source: 'mock'
  };
}

function getMockBookingDetails(booking) {
  return {
    success: true,
    suggestions: `Personalized Travel Guide for ${booking.tripData.destination}

🏛️ TOP ATTRACTIONS:
1. Historic landmarks and monuments
2. Natural scenic viewpoints
3. Cultural centers and museums
4. Local markets and bazaars

🍽️ FOOD & DINING:
- Try authentic local cuisine
- Visit popular restaurants in city center
- Don't miss street food delicacies
- Recommended: Traditional breakfast spots

📅 SUGGESTED ITINERARY:
Day 1: Arrival & city orientation
Day 2: Major attractions tour
Day 3: Local experiences & shopping
Day 4: Hidden gems & departure prep

🎭 CULTURAL TIPS:
- Respect local customs and traditions
- Learn basic local phrases
- Dress modestly at religious sites
- Ask permission before photography

🛍️ SHOPPING:
- Local handicrafts and souvenirs
- Traditional textiles and clothing
- Authentic spices and teas
- Art galleries and markets

📸 PHOTOGRAPHY SPOTS:
- Sunrise/sunset viewpoints
- Historic architecture
- Local street scenes
- Nature landscapes

Note: Add VITE_GEMINI_API_KEY to .env for AI-powered personalized suggestions!`,
    source: 'mock'
  };
}