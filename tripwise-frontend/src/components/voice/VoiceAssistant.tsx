import { useEffect, useState } from "react";
import { Mic, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  from: "user" | "assistant";
  text: string;
}

export const VoiceAssistant = () => {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!open) {
      setListening(false);
    }
  }, [open]);

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  const handleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Voice not available", description: "Your browser doesn&apos;t support speech input yet." });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = (event.results[0][0].transcript as string).trim();
      setMessages((prev) => [...prev, { from: "user", text: transcript }]);

      let response = "I can help you plan, book, or guide your trip.";

      const lower = transcript.toLowerCase();
      if (lower.includes("plan")) {
        response = "Opening the trip planner for you.";
        navigate("/plan");
      } else if (lower.includes("book") || lower.includes("options")) {
        response = "Let&apos;s look at some example options.";
        navigate("/options");
      } else if (lower.includes("guide") || lower.includes("local")) {
        response = "Showing a local guide for your destination.";
        navigate("/guide", { state: { city: "Goa" } });
      } else if (lower.includes("home")) {
        response = "Taking you back to the TripWise home page.";
        navigate("/");
      }

      const reply: Message = { from: "assistant", text: response };
      setMessages((prev) => [...prev, reply]);
      speak(response);
    };

    recognition.start();
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col items-end justify-end p-4 md:p-6">
      {open && (
        <div className="pointer-events-auto mb-4 w-full max-w-sm rounded-3xl bg-card/95 p-4 shadow-xl backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">TripWise voice</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-[11px]"
              aria-label="Close voice assistant"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="mb-3 max-h-40 space-y-2 overflow-y-auto text-xs">
            {messages.length === 0 && (
              <p className="text-muted-foreground">
                Ask things like “Plan a trip to Goa”, “Show my options”, or “Open local guide”.
              </p>
            )}
            {messages.map((m, i) => (
              <p key={i} className={m.from === "assistant" ? "text-primary" : "text-foreground"}>
                <span className="font-semibold">{m.from === "assistant" ? "TripWise:" : "You:"}</span> {m.text}
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={handleVoice}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-md hover:bg-primary/90"
          >
            <Mic className="h-4 w-4" /> {listening ? "Listening..." : "Tap to speak"}
          </button>
          {!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Voice isn&apos;t supported here. Use the main pages to click through the demo.
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        aria-label="Open TripWise voice assistant"
      >
        {open ? <X className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>
    </div>
  );
};
