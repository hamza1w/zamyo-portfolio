import { useEffect, useRef, useState } from "react";

/**
 * Adds the .is-visible class (see .reveal in global.css) once an element
 * scrolls into view. One-shot — it doesn't re-hide on scroll away, so the
 * page never feels like it's replaying itself.
 */
export function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
