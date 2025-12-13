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
      className={`p-3 rounded-full transition-all ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
          : 'bg-blue-600 hover:bg-blue-700'
      } text-white`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
    </button>
  );
}
