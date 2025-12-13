# TripWise - AI Travel Companion

An AI-powered travel planning application that helps users plan their dream trips with intelligent suggestions and recommendations.

## ✨ Features

- **AI-Powered Trip Planning**: Get personalized travel suggestions using Google Gemini AI
- **Voice Input**: Use voice commands to fill in travel details
- **Multi-Language Support**: Available in 10+ languages (English, Hindi, Spanish, French, German, Chinese, Japanese, Arabic, Portuguese, Russian)
- **Trip Customization**: 
  - Select trip type (Solo, Honeymoon, Family, Friends)
  - Specify number of travelers
  - Choose travel mode (Flight, Train, Bus)
  - Set budget preferences
- **Beautiful UI**: Smooth animations and modern design inspired by snig.digital and cabanana.pt
- **Responsive Design**: Works perfectly on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- (Optional) Google Gemini API key for AI-powered features

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tripwise-ai-travel-companion
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. (Optional) Set up AI Integration:
   - Copy `.env.example` to `.env`
   - Get your Google Gemini API key from: https://makersuite.google.com/app/apikey
   - Add your API key to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
   
   **Note**: If you don't provide an API key, the app will work with mock AI responses.

4. Run the development server:
```bash
npm run dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

1. **Start Journey**: Enter your name first, then your contact information
2. **Plan Trip**: 
   - Enter your name
   - Select trip type (Solo, Honeymoon, Family, or Friends)
   - Specify number of travelers
   - Enter departure location and destination
   - Choose travel date and optional budget
   - Select travel mode
3. **Voice Input**: Click the microphone button next to any field to use voice input
4. **Language Selection**: Click the language selector in the navbar to change language
5. **View AI Suggestions**: Get personalized recommendations based on your trip details

## 🎨 Design Features

- **Smooth Animations**: Framer Motion and GSAP for premium animations
- **Pastel Color Scheme**: Calm, beautiful light theme
- **Glassmorphism**: Modern frosted glass effects
- **Scroll Animations**: Smooth color transitions and effects
- **Full-Screen Menu**: Inspired by cabanana.pt

## 🔧 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom design system
- **Animations**: Framer Motion + GSAP
- **AI**: Google Gemini AI (or ChatGPT - configurable)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Voice**: Web Speech API

## 🌐 Supported Languages

The app supports language selection for:
- English (🇺🇸)
- Hindi (🇮🇳)
- Spanish (🇪🇸)
- French (🇫🇷)
- German (🇩🇪)
- Chinese (🇨🇳)
- Japanese (🇯🇵)
- Arabic (🇸🇦)
- Portuguese (🇵🇹)
- Russian (🇷🇺)

*Note: Full translation requires i18n library implementation*

## 🤖 AI Integration

The app is designed to work with:

1. **Google Gemini AI** (Currently implemented)
   - Add `VITE_GEMINI_API_KEY` to your `.env` file
   - Provides intelligent trip suggestions and local guides

2. **OpenAI ChatGPT** (Ready for implementation)
   - Can be configured using `VITE_OPENAI_API_KEY`
   - Implementation available in `src/services/aiService.js`

If no API key is provided, the app automatically falls back to mock responses.

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx   # Navigation with language selector
│   ├── VoiceInput.jsx # Voice input component
│   └── ...
├── pages/           # Route pages
│   ├── Home.jsx
│   ├── IdentifyUser.jsx  # User identification (name + contact)
│   ├── PlanTrip.jsx      # Main trip planning form
│   ├── Booking.jsx
│   ├── Payment.jsx
│   └── LocalGuide.jsx
├── services/        # API and AI services
│   ├── api.js       # Main API service
│   └── aiService.js # AI integration (Gemini/ChatGPT)
├── hooks/           # Custom React hooks
└── index.css        # Global styles and design system
```

## 🎯 Key Improvements Made

1. ✅ Fixed input/delete functionality in PlanTrip form
2. ✅ Integrated Google Gemini AI for intelligent suggestions
3. ✅ Reordered form fields (name before phone/email)
4. ✅ Made voice buttons more visible with better styling
5. ✅ Added trip type selection (Solo, Honeymoon, Family, Friends)
6. ✅ Added number of travelers field
7. ✅ Fixed language selection functionality
8. ✅ Added 10+ language options

## 🚧 Future Enhancements

- Full i18n translation implementation
- OpenAI ChatGPT integration as alternative AI provider
- User authentication and trip history
- Real booking API integration
- Payment gateway integration
- Social sharing features
- Trip collaboration features

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ using React, AI, and modern web technologies
