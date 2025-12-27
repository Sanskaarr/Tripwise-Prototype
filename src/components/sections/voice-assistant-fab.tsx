import React from 'react';
import { Mic } from 'lucide-react';

const VoiceAssistantFab = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col items-end justify-end p-4 md:p-6">
      <button
        type="button"
        className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0D9488] text-white shadow-lg transition-all duration-300 hover:bg-[#0D9488]/90 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:ring-offset-2"
        aria-label="Open TripWise voice assistant"
        style={{
          boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(13, 148, 136, 0.2)',
          backgroundColor: '#0D9488'
        }}
      >
        <Mic className="h-5 w-5" strokeWidth={2.25} />
      </button>
    </div>
  );
};

export default VoiceAssistantFab;