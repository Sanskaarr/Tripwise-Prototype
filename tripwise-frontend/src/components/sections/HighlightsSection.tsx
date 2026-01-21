import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const HighlightsSection = () => {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const items = [
        {
            eyebrow: "01",
            icon: "✨",
            title: "Plan with TripWise AI",
            body: "Share how you travel and let TripWise sketch routes, timings, and must-see moments in seconds.",
            gradient: "from-blue-500/20 to-cyan-500/20",
        },
        {
            eyebrow: "02",
            icon: "🌍",
            title: "Itineraries that flex",
            body: "Swap plans on the fly. Your companion adapts days around energy, weather, and what you discover.",
            gradient: "from-purple-500/20 to-pink-500/20",
        },
        {
            eyebrow: "03",
            icon: "📍",
            title: "One clear brief",
            body: "Keep confirmations, directions, and local notes in a single, cinematic trip view you can just follow.",
            gradient: "from-indigo-500/20 to-blue-500/20",
        },
    ];

    return (
        <section
            id="highlights"
            ref={ref}
            className={cn(
                "relative py-44 md:py-72 transition-all duration-1000 ease-out motion-safe:translate-y-12 motion-safe:opacity-0 overflow-hidden",
                visible && "motion-safe:translate-y-0 motion-safe:opacity-100"
            )}
        >
            {/* Enhanced Background Elements */}
            <motion.div
                className="absolute top-0 left-1/4 -z-10 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-primary/10 to-blue-500/10 blur-[160px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-0 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-[140px]"
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />

            <div className="site-container">
                <motion.div
                    className="mb-36 flex flex-col items-center text-center space-y-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={visible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <motion.p
                        className="font-handwriting text-2xl sm:text-4xl text-primary/50 italic relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={visible ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        The Art of Exploration
                        <motion.div
                            className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                            initial={{ scaleX: 0 }}
                            animate={visible ? { scaleX: 1 } : {}}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </motion.p>

                    <motion.h2
                        className="font-display text-4xl sm:text-5xl font-light tracking-tighter md:text-7xl lg:text-[6.5rem] leading-[0.9]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={visible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        A calm companion <br /> for every journey.
                    </motion.h2>

                    <motion.div
                        className="h-px w-48 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={visible ? { scaleX: 1 } : {}}
                        transition={{ duration: 1, delay: 0.6 }}
                    />
                </motion.div>

                <div className="grid gap-16 md:grid-cols-3">
                    {items.map((item, index) => (
                        <motion.article
                            key={item.title}
                            className="glass-panel group relative flex flex-col p-12 space-y-12 overflow-hidden"
                            initial={{ opacity: 0, y: 40 }}
                            animate={visible ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
                            whileHover={{ y: -8 }}
                        >
                            {/* Gradient background on hover */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-700`}
                                initial={false}
                                whileHover={{ opacity: 1 }}
                            />

                            {/* Animated corner accent */}
                            <motion.div
                                className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={visible ? { scale: 1, opacity: 1 } : {}}
                                transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
                            />

                            <div className="relative space-y-10">
                                {/* Icon + Number */}
                                <div className="flex items-center justify-between">
                                    <motion.span
                                        className="text-5xl"
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.5,
                                        }}
                                    >
                                        {item.icon}
                                    </motion.span>
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.5em] text-primary/60">
                                        {item.eyebrow}
                                    </span>
                                </div>

                                {/* Animated divider */}
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        className="h-px flex-1 bg-gradient-to-r from-primary/20 via-primary/40 to-transparent"
                                        initial={{ scaleX: 0 }}
                                        animate={visible ? { scaleX: 1 } : {}}
                                        transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
                                        style={{ transformOrigin: 'left' }}
                                    />
                                </div>

                                <motion.h3
                                    className="font-display text-3xl font-light leading-[1.1] tracking-tight md:text-4xl"
                                    initial={{ opacity: 0 }}
                                    animate={visible ? { opacity: 1 } : {}}
                                    transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
                                >
                                    {item.title}
                                </motion.h3>

                                <motion.p
                                    className="font-sans text-[17px] font-light leading-relaxed text-muted-foreground/80 transition-colors group-hover:text-foreground/90"
                                    initial={{ opacity: 0 }}
                                    animate={visible ? { opacity: 1 } : {}}
                                    transition={{ duration: 0.6, delay: 0.7 + index * 0.15 }}
                                >
                                    {item.body}
                                </motion.p>
                            </div>

                            <motion.button
                                className="group/btn relative flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground transition-all hover:gap-7 hover:text-primary"
                                whileHover={{ x: 6 }}
                            >
                                Explore Method
                                <motion.div
                                    className="h-px w-10 bg-muted-foreground/40 transition-all group-hover/btn:w-16 group-hover/btn:bg-primary"
                                    initial={{ scaleX: 0 }}
                                    animate={visible ? { scaleX: 1 } : {}}
                                    transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
                                    style={{ transformOrigin: 'left' }}
                                />
                            </motion.button>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};
