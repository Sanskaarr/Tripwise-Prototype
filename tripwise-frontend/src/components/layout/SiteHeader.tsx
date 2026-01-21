import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { id: "home", label: "Home", sub: "The starting point" },
    { id: "auth", label: "Start Journey", sub: "Craft your itinerary" },
];

export const SiteHeader = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
    }, [menuOpen]);

    const handleNav = (id: string) => {
        setMenuOpen(false);
        if (id === "home") {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            navigate(`/${id}`);
        }
    };

    return (
        <header className="fixed inset-x-0 top-0 z-[100] flex justify-center p-3 sm:p-6 transition-all duration-500">
            {/* Floating Header Bar */}
            <div
                className={cn(
                    "relative z-[110] flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 py-3 transition-all duration-500",
                    scrolled ? "rounded-full" : "bg-transparent"
                )}
            >
                {/* Separate Glass Layer to prevent interference with content */}
                {scrolled && (
                    <div className="ios-glass absolute inset-0 -z-10 rounded-full shadow-lg" />
                )}

                <button
                    onClick={() => navigate("/")}
                    className="relative z-[120] flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                >
                    <span className={cn(
                        "font-display text-2xl font-medium tracking-tight transition-colors duration-500 text-white drop-shadow-md",
                    )}>
                        TripWise
                    </span>
                </button>

                <button
                    onClick={() => setMenuOpen(true)}
                    className={cn(
                        "relative z-[120] flex items-center gap-3 rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 text-white hover:bg-white/10 active:scale-95",
                        scrolled ? "bg-white/5" : "bg-white/10"
                    )}
                >
                    <span>Menu</span>
                    <Menu className="h-3 w-3" />
                </button>
            </div>

            {/* Full Screen Menu Overlay */}
            <div
                className={`fixed inset-0 z-[150] flex flex-col transition-all duration-400 ease-out ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
                    }`}
            >
                {/* Liquid Glass Background */}
                <div className="liquid-glass absolute inset-0 !bg-background/40 backdrop-blur-[60px]" />

                <div className="relative flex h-full flex-col px-8 pb-12 pt-8 md:px-24">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="font-display text-xl font-medium tracking-tight">TripWise</span>
                        </div>

                        <button
                            onClick={() => setMenuOpen(false)}
                            className="group flex h-12 w-12 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 transition-all hover:bg-foreground hover:text-background"
                        >
                            <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
                        </button>
                    </div>

                    <nav className="flex flex-1 flex-col justify-center space-y-6 md:space-y-10">
                        {NAV_ITEMS.map((item, i) => (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.id)}
                                className="group flex flex-col items-start text-left transition-all hover:translate-x-6"
                                style={{
                                    transitionDelay: `${i * 100}ms`,
                                    opacity: menuOpen ? 1 : 0,
                                    transform: menuOpen ? 'translateX(0)' : 'translateX(-40px)'
                                }}
                            >
                                <div className="flex items-baseline gap-4">
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground transition-colors group-hover:text-primary">
                                        0{i + 1}
                                    </span>
                                    <span className="font-display text-5xl font-light tracking-tighter transition-all group-hover:tracking-normal md:text-8xl">
                                        {item.label}
                                    </span>
                                </div>
                                <span className="ml-14 font-handwriting text-lg italic text-muted-foreground transition-colors group-hover:text-primary md:text-2xl">
                                    {item.sub}
                                </span>
                            </button>
                        ))}
                    </nav>

                    <div className="flex flex-wrap items-center justify-between gap-6 border-t border-foreground/5 pt-8 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
                        <span className="font-medium">© 2024 TripWise AI · The Art of Travel</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
