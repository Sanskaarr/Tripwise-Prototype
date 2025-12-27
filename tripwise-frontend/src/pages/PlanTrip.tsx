import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { tripAPI } from "@/services/api";

const PlanTripPage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [mode, setMode] = useState("train");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Voice not available", description: "Your browser doesn't support speech input yet." });
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
      const transcript = event.results[0][0].transcript as string;
      setTo(transcript);
      toast({ title: "Got it", description: `Destination set to: ${transcript}` });
    };

    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !date) {
      toast({ title: "Add your trip details", description: "From, destination, and date are required." });
      return;
    }

    setLoading(true);
    toast({ title: "Planning your trip", description: "Fetching personalized options for you..." });

    try {
      const response = await tripAPI.planTrip({
        destination: to,
        startDate: date,
        endDate: date, // For simplicity using same date
        interests: ["Sightseeing", "Food"],
        budget: budget || "Moderate",
        travelers: 1
      });

      if (response.success) {
        navigate("/options", { state: { from, to, date, budget, mode, aiSuggestions: response.data.aiSuggestions } });
      } else {
        toast({ variant: "destructive", title: "Planning failed", description: response.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to plan trip. Please check your connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-2xl glass-card p-6 md:p-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Step 2</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-white">Tell TripWise about your trip</h1>
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              From
            </label>
            <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g., Mumbai" />
          </div>
          <div className="md:col-span-1">
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Destination
              </label>
              <button
                type="button"
                onClick={handleVoice}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary"
              >
                {listening ? "Listening..." : "Use voice"}
              </button>
            </div>
            <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g., Goa" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Date
            </label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Budget (optional)
            </label>
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="₹ 25,000"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Mode
            </label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 mt-4 flex justify-end">
            <Button type="submit" className="text-xs uppercase tracking-[0.24em]">
              See options
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PlanTripPage;
