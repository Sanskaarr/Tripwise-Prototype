import { Mic, MicOff } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';
import { useEffect } from 'react';

export function VoiceInput({ onTranscript }) {
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
      className={`relative p-4 rounded-xl transition-all duration-300 group shadow-xl ${
        isListening 
          ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse shadow-2xl shadow-red-500/50' 
          : 'bg-accent-coral hover:bg-accent-coral/80 shadow-lg hover:shadow-2xl'
      } text-white`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <>
          <MicOff size={24} className="text-white relative z-10" />
          <span className="absolute inset-0 rounded-xl bg-red-500 opacity-50 animate-ping" />
        </>
      ) : (
        <Mic size={24} className="text-white" />
      )}
    </button>
  );
}
