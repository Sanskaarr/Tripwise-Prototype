# TripWise Frontend

React + Vite frontend for the TripWise AI Travel Companion.

## 🚀 Quick Start

```bash
bun install
bun dev
```

Frontend runs on: http://localhost:3000

## ✨ Features

- **AI-Powered Trip Planning**: Get personalized travel suggestions using Google Gemini AI
- **Voice Input**: Use voice commands to fill in travel details
- **Multi-Language Support**: Available in 10+ languages
- **Trip Customization**: Solo, Honeymoon, Family, Friends trips with budget preferences
- **Beautiful UI**: Smooth animations with Framer Motion + GSAP
- **Responsive Design**: Works on all devices

## 🔧 Tech Stack

- React 18 + Vite
- TailwindCSS
- Framer Motion + GSAP
- React Router DOM
- Lucide React (icons)
- Web Speech API (voice input)

## 📝 Environment Variables

Create a `.env` file:

```
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Route pages
├── services/        # API and AI services
├── hooks/           # Custom React hooks
└── contexts/        # React contexts
```

## 🌐 Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun preview` - Preview production build

## 📄 License

MIT License
