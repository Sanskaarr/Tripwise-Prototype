"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, X, Send, Bot, User, Volume2 } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
}

const responses: Record<string, string> = {
  hello: "Hello! I'm TripWise assistant. How can I help you plan your trip today?",
  hi: "Hi there! Ready to help you with your travel plans. Where would you like to go?",
  help: "I can help you plan trips, find booking options, get local guides, and more. Just ask!",
  book: "To book a trip, go to the Plan Trip page and enter your travel details. I'll find the best options for you!",
  payment: "We support UPI payments. Once you select your travel and hotel, you can pay using any UPI app.",
  guide: "Check out our Local Guide section for attractions, food recommendations, and travel tips for your destination.",
  default: "I understand you need help with your trip. Could you tell me more about what you're looking for?",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, value] of Object.entries(responses)) {
    if (lower.includes(key)) return value;
  }
  return responses.default;
}

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! I'm your TripWise assistant. How can I help you today?", sender: "assistant" },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, speak, isSupported } = useSpeech();

  useEffect(() => {
    if (transcript) {
      handleSend(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    setTimeout(() => {
      const response = getResponse(text);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      speak(response);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all ${
          isOpen ? "scale-0" : "scale-100"
        } bg-gradient-to-br from-sky-500 to-emerald-500 text-white hover:shadow-xl hover:shadow-sky-200`}
      >
        <Bot className="w-6 h-6 mx-auto" />
      </button>

      <div
        className={`fixed bottom-6 right-6 z-50 w-[90vw] max-w-md transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-emerald-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">TripWise Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user" ? "bg-sky-100" : "bg-emerald-100"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-4 h-4 text-sky-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-sky-500 text-white rounded-tr-sm"
                      : "bg-white text-slate-700 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                {msg.sender === "assistant" && (
                  <button
                    onClick={() => speak(msg.text)}
                    className="p-1.5 hover:bg-slate-200 rounded-full transition-colors mt-1"
                  >
                    <Volume2 className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2">
              {isSupported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-3 rounded-full transition-all ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isListening ? "Listening..." : "Type your message..."}
                className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-sky-200"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
