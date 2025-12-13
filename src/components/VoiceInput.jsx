import { Mic, MicOff } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useEffect } from 'react';

export function VoiceInput({ onTranscript, value }) {
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeech();

  useEffect(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      className={`relative p-5 rounded-xl transition-all duration-300 group min-w-[72px] font-semibold ${
        isListening 
          ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse shadow-2xl shadow-red-500/60 scale-105' 
          : 'bg-gradient-to-br from-accent-coral to-accent-lavender hover:scale-105 hover:shadow-xl hover:shadow-accent-coral/40 border-2 border-accent-coral/30'
      } text-white`}
      title={isListening ? 'Click to stop recording' : 'Click to start voice input'}
    >
      <div className="flex items-center justify-center gap-2">
        {isListening ? (
          <>
            <MicOff size={26} className="text-white animate-bounce" />
            <span className="absolute inset-0 rounded-xl bg-red-500 opacity-40 animate-ping" />
          </>
        ) : (
          <Mic size={26} className="text-white group-hover:scale-110 transition-transform" />
        )}
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-charcoal">
        {isListening ? 'Recording...' : 'Voice Input'}
      </div>
    </button>
  );
}