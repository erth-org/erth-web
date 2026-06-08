import { createElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/asset-path";

export function HeroVisual({ className }: { className?: string }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const visualRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const node = visualRef.current;
    if (!node) return;

    if (reduceMotion) {
      node.style.transform = "none";
      node.style.opacity = "1";
      return;
    }

    let frame = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const update = () => {
      frame = 0;
      const distance = Math.max(1, window.innerHeight * 0.72);
      const progress = clamp(window.scrollY / distance);
      const scale = 1 - progress * 0.2;
      const translateY = progress * -18;
      const opacity = 1 - progress * 0.08;

      node.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      node.style.opacity = String(opacity);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [reduceMotion]);

  return (
    <div
      ref={visualRef}
      className={cn("relative aspect-square w-full max-w-lg overflow-hidden", className)}
      aria-label="Animated globe of connected places"
      role="img"
      style={{ transform: reduceMotion ? undefined : "scale(1)", transformOrigin: "center" }}
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
