import { createElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/asset-path";

export function HeroVisual({ className }: { className?: string }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const playerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    setReduceMotion(query.matches);
    const onChange = () => setReduceMotion(query.matches);
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const player = playerRef.current as
      | (HTMLElement & { play?: () => void; stop?: () => void })
      | null;
    if (!player) return;

    if (reduceMotion) {
      player.removeAttribute("autoplay");
      player.removeAttribute("loop");
      player.stop?.();
      return;
    }

    const start = () => {
      player.setAttribute("autoplay", "true");
      player.setAttribute("loop", "true");
      player.play?.();
    };

    const frame = window.requestAnimationFrame(start);
    const retry = window.setTimeout(start, 350);
    window.addEventListener("pageshow", start);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
      window.removeEventListener("pageshow", start);
    };
  }, [reduceMotion]);

  return (
    <div
      className={cn("relative aspect-square w-full max-w-lg overflow-hidden", className)}
      aria-label="Animated globe of connected places"
      role="img"
    >
      {/*
        The custom element is registered by the root module script. Attributes
        are passed through with React.createElement because TypeScript does not
        know the dotlottie-player JSX intrinsic element.
      */}
      {createElement("dotlottie-player", {
        ref: playerRef,
        src: withBasePath("animations/globe-animation.lottie"),
        background: "transparent",
        speed: "1",
        loop: reduceMotion ? undefined : "true",
        autoplay: reduceMotion ? undefined : "true",
        class: "absolute inset-0 size-full",
      })}
    </div>
  );
}
