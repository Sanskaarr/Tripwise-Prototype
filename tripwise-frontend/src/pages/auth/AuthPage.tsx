import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LiquidBackground } from "@/components/ui/LiquidBackground";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useProfileStore } from "@/store/profileStore";
import { checkUserExists } from "@/lib/api/authApi";

const AuthPage = () => {
    const navigate = useNavigate();
    const authenticateUser = useProfileStore(state => state.authenticateUser);

    const [identifier, setIdentifier] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Detect if input is phone or email
    const detectInputType = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;

        if (emailRegex.test(value)) return "email";
        if (phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) return "phone";
        return "unknown";
    };

    const handleContinue = async () => {
        if (!identifier.trim()) {
            setError("Please enter your phone number or email");
            return;
        }

        const inputType = detectInputType(identifier);
        if (inputType === "unknown") {
            setError("Please enter a valid phone number or email address");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await checkUserExists(identifier.trim());

            if (response.success && response.data) {
                const { exists, profile } = response.data;

                if (exists && profile) {
                    // Returning user - load profile and go to chat
                    authenticateUser(identifier, profile);
                    navigate("/chat", { state: { isReturning: true } });
                } else {
                    // New user - go to onboarding
                    authenticateUser(identifier);
                    navigate("/plan", { state: { isNew: true } });
                }
            } else {
                setError(response.error || "Failed to check user status. Please try again.");
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <LiquidBackground />
            <SiteHeader />

            <div className="relative flex min-h-screen items-center justify-center px-4">
                {/* Floating glass orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full liquid-glass opacity-10 blur-3xl"
                    animate={{
                        y: [-30, 30, -30],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full ios-glass opacity-15 blur-3xl"
                    animate={{
                        y: [20, -40, 20],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3,
                    }}
                />

                <motion.div
                    className="relative w-full max-w-lg"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Main glass panel */}
                    <div className="ios-glass relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer opacity-40" />

                        {/* Glows */}
                        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-3xl" />
                        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/20 blur-3xl" />

                        <div className="relative space-y-8">
                            <div className="space-y-4 text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                                        Let's Begin
                                    </p>

                                    <motion.h1
                                        className="mt-6 font-display text-4xl md:text-5xl font-light tracking-tight leading-[1]"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                    >
                                        Welcome to
                                        <span className="mt-2 block font-handwriting text-4xl md:text-5xl italic lowercase text-primary/90">
                                            TripWise
                                        </span>
                                    </motion.h1>
                                </motion.div>

                                <motion.p
                                    className="mx-auto max-w-md text-base text-muted-foreground/80 leading-relaxed md:text-lg font-light"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                >
                                    Enter your phone number or email to continue your journey
                                </motion.p>
                            </div>

                            {/* Divider */}
                            <motion.div
                                className="flex items-center gap-4"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.8, duration: 0.8 }}
                            >
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                            </motion.div>

                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.6 }}
                            >
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="identifier"
                                        className="text-sm font-medium tracking-wide"
                                    >
                                        Phone Number or Email
                                    </Label>
                                    <Input
                                        id="identifier"
                                        type="text"
                                        placeholder="Enter your phone or email"
                                        value={identifier}
                                        onChange={(e) => {
                                            setIdentifier(e.target.value);
                                            setError(null);
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && !isLoading && handleContinue()}
                                        className="h-16 rounded-2xl border-white/20 bg-white/5 px-6 text-lg backdrop-blur-xl transition-all duration-300 placeholder:text-muted-foreground/40 focus:border-primary/50 focus:bg-white/10 focus:ring-2 focus:ring-primary/20"
                                        autoFocus
                                        disabled={isLoading}
                                    />
                                    {error && (
                                        <motion.p
                                            className="text-sm text-red-400"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </div>

                                <Button
                                    onClick={handleContinue}
                                    disabled={!identifier.trim() || isLoading}
                                    size="lg"
                                    className="group relative h-16 w-full overflow-hidden rounded-2xl bg-primary text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <span className="relative z-10">
                                        {isLoading ? "Checking..." : "Continue"}
                                    </span>
                                    {!isLoading && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                                            initial={{ x: "-100%" }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    )}
                                </Button>
                            </motion.div>

                            {/* Bottom quote */}
                            <motion.p
                                className="text-center font-handwriting text-xl italic text-muted-foreground/50 md:text-2xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.8 }}
                            >
                                "Every journey begins with a single step"
                            </motion.p>
                        </div>
                    </div>

                    {/* Floating particles */}
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-white/20 blur-sm"
                            style={{
                                left: `${10 + i * 15}%`,
                                top: `${20 + (i % 2) * 60}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.6, 0.2],
                            }}
                            transition={{
                                duration: 4 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.5,
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </>
    );
};

export default AuthPage;
