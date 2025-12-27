import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const IdentifyPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      toast({ title: "Add your phone or email", description: "We&apos;ll use it just to personalize this demo." });
      return;
    }

    const key = `tripwise-user-${identifier.trim().toLowerCase()}`;
    const hasVisited = sessionStorage.getItem(key);
    const isReturning = Boolean(hasVisited);

    setMessage(isReturning ? "Welcome back" : "Let&apos;s plan your first trip");
    sessionStorage.setItem(key, "1");

    setTimeout(() => {
      navigate("/plan");
    }, 900);
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 md:py-20">
      <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-lg md:p-8">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Step 1</p>
        <h1 className="mb-3 text-2xl font-semibold">Who&apos;s planning this trip?</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Add a phone number or email so TripWise can remember this demo session.
        </p>
        <form onSubmit={handleContinue} className="space-y-4">
          <Input
            type="text"
            autoComplete="off"
            placeholder="Phone or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          {message && <p className="text-sm font-medium text-primary">{message}</p>}
          <Button type="submit" className="w-full text-xs uppercase tracking-[0.24em]">
            Continue
          </Button>
        </form>
      </div>
    </main>
  );
};

export default IdentifyPage;
