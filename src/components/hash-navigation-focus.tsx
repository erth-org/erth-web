import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

/**
 * Moves keyboard and assistive-technology focus to the destination of a
 * completed hash navigation. Scrolling remains owned by TanStack Router so
 * browser history restoration and sticky-header offsets continue to work.
 */
export function HashNavigationFocus() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const hash = useLocation({ select: (location) => location.hash });

  useEffect(() => {
    if (!hash) return;

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(hash);

      if (target instanceof HTMLElement) {
        target.focus({ preventScroll: true });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash, pathname]);

  return null;
}
