"use client";

import { Mic, MicOff, Volume2 } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";
import { useEffect } from "react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export function VoiceInput({ onTranscript, placeholder, className = "" }: VoiceInputProps) {
  const { isListening, transcript, startListening, stopListening, isSupported, error } = useSpeech();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        className={`relative p-3 rounded-full transition-all ${
          isListening
            ? "bg-red-500 text-white animate-pulse"
            : "bg-sky-100 text-sky-600 hover:bg-sky-200"
        }`}
      >
        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        {isListening && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </button>
      {placeholder && !isListening && (
        <span className="text-sm text-slate-400">{placeholder}</span>
      )}
      {isListening && (
        <span className="text-sm text-red-500 animate-pulse">Listening...</span>
      )}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}

export function SpeakButton({ text }: { text: string }) {
  const { speak, isSpeaking } = useSpeech();

  return (
    <button
      onClick={() => speak(text)}
      disabled={isSpeaking}
      className={`p-2 rounded-full transition-all ${
        isSpeaking ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-pulse" : ""}`} />
    </button>
  );
}
