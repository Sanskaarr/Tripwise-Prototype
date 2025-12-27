import { useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  /** How much of the element should be visible before revealing (0-1). */
  threshold?: number;
}

export const useScrollReveal = ({ threshold = 0.18 }: UseScrollRevealOptions = {}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, visible]);

  return { ref, visible } as const;
};
