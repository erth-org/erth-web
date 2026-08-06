import { createElement, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/asset-path";

const MOBILE_MEDIA_QUERY = "(max-width: 639px)";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

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
      node.style.willChange = "auto";
      return;
    }

    const mobileQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    let animationFrame = 0;
    let lastFrameTime = 0;
    let currentScale = 1;
    let currentOffset = 0;
    let targetScale = 1;
    let targetOffset = 0;

    const setTargets = () => {
      const isMobile = mobileQuery.matches;
      const distance = Math.max(1, window.innerHeight * (isMobile ? 0.95 : 0.8));
      const progress = smoothstep(clamp(window.scrollY / distance));

      // A restrained range keeps the large mobile canvas feeling grounded while
      // still giving the hero some depth as it leaves the viewport.
      targetScale = 1 - progress * (isMobile ? 0.065 : 0.16);
      targetOffset = isMobile ? progress * -8 : 0;
    };

    const applyTransform = () => {
      node.style.transform = `translate3d(0, ${currentOffset.toFixed(3)}px, 0) scale(${currentScale.toFixed(5)})`;
    };

    const animate = (time: number) => {
      const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 64) : 16;
      lastFrameTime = time;

      // Time-based damping is consistent across 60Hz and 120Hz mobile screens.
      const damping = 1 - Math.exp(-elapsed / (mobileQuery.matches ? 105 : 80));
      currentScale += (targetScale - currentScale) * damping;
      currentOffset += (targetOffset - currentOffset) * damping;
      applyTransform();

      const settled =
        Math.abs(targetScale - currentScale) < 0.0001 &&
        Math.abs(targetOffset - currentOffset) < 0.02;

      if (settled) {
        currentScale = targetScale;
        currentOffset = targetOffset;
        applyTransform();
        animationFrame = 0;
        lastFrameTime = 0;
        node.style.willChange = "auto";
        return;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      setTargets();
      if (animationFrame) return;
      node.style.willChange = "transform";
      animationFrame = window.requestAnimationFrame(animate);
    };

    const resetForViewport = () => {
      setTargets();
      currentScale = targetScale;
      currentOffset = targetOffset;
      applyTransform();
    };

    resetForViewport();
    window.addEventListener("scroll", startAnimation, { passive: true });
    window.addEventListener("resize", resetForViewport);
    mobileQuery.addEventListener?.("change", resetForViewport);
    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", startAnimation);
      window.removeEventListener("resize", resetForViewport);
      mobileQuery.removeEventListener?.("change", resetForViewport);
      node.style.willChange = "auto";
    };
  }, [reduceMotion]);

  return (
    <div
      ref={visualRef}
      className={cn("relative aspect-square w-full max-w-lg overflow-hidden", className)}
      aria-label="Animated globe of connected places"
      role="img"
      style={{
        backfaceVisibility: "hidden",
        contain: "layout paint",
        isolation: "isolate",
        transform: reduceMotion ? undefined : "translate3d(0, 0, 0) scale(1)",
        transformOrigin: "center",
      }}
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
        speed: "0.85",
        loop: reduceMotion ? undefined : "true",
        autoplay: reduceMotion ? undefined : "true",
        renderer: "canvas",
        class: "absolute inset-0 size-full transform-gpu",
      })}
    </div>
  );
}
