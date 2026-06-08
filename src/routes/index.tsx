import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Download } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { vision, coreIdeas, audiences } from "@/lib/erth-content";
import { Reveal } from "@/components/reveal";
import { HeroVisual } from "@/components/hero-visual";
import { QrDownload } from "@/components/qr-download";
import { StarBackdrop } from "@/components/star-backdrop";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      title: "Erth",
      description: siteConfig.oneLiner,
      path: "/",
    }),
  component: HomePage,
});

/**
 * Handles /#download deep-links from other routes: scroll to the Download
 * section after render and move focus there. Honors reduced-motion.
 */
function useDownloadHash() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    const scrollToDownload = () => {
      if (window.location.hash !== "#download") return;
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      raf = window.requestAnimationFrame(() => {
        const el = document.getElementById("download");
        if (!el) return;
        el.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
        // Move keyboard focus to the section without an extra scroll jump.
        el.focus({ preventScroll: true });
      });
    };

    // Handle both initial deep-link and same-page hash clicks.
    scrollToDownload();
    window.addEventListener("hashchange", scrollToDownload);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", scrollToDownload);
    };
  }, []);
}

function HomePage() {
  useDownloadHash();

  const demoSnapshot = [
    { label: "[Demo] Saved places", value: "128", detail: "Mock count for layout review" },
    { label: "[Demo] Private moments", value: "342", detail: "Mock count for layout review" },
    { label: "[Demo] Shared collections", value: "12", detail: "Mock count for layout review" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-14 sm:pt-28 sm:pb-24">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_1.05fr] md:gap-12">
            <Reveal className="space-y-5 sm:space-y-6">
              <h1 className="text-balance text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                A living digital map of your world.
              </h1>
              <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-lg">
                Capture meaningful experiences and build a lasting digital footprint of where you
                have been and what mattered along the way.
              </p>
              <div className="grid gap-3 pt-1 sm:flex sm:flex-wrap sm:items-center sm:pt-2">
                <Link
                  to="/"
                  hash="download"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="size-4" aria-hidden="true" />
                  <span className="sm:hidden">Download</span>
                  <span className="hidden sm:inline">Download the app</span>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Learn more
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <Reveal delayMs={120} className="flex justify-center overflow-visible text-foreground">
              <HeroVisual className="w-[110vw] max-w-none shrink-0 sm:w-full sm:max-w-xl lg:max-w-[34rem]" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/20">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <Reveal className="mb-6 max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
              Demo snapshot — not published information
            </p>
          </Reveal>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {demoSnapshot.map((item, i) => (
              <Reveal
                key={item.label}
                delayMs={i * 70}
                className="rounded-xl border border-border bg-card p-3 sm:rounded-2xl sm:p-5"
              >
                <p className="erth-mobile-clamp-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground sm:text-[10px]">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:mt-3 sm:text-3xl">
                  {item.value}
                </p>
                <p className="mt-1 hidden text-sm text-muted-foreground sm:block">{item.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:py-20">
          <Reveal className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Our vision
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {vision.problem}
            </p>
            <p className="hidden text-base leading-relaxed text-muted-foreground sm:block">
              {vision.why}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {vision.future}
            </p>
            <p className="hidden text-base leading-relaxed text-muted-foreground sm:block">
              {vision.contribution}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Ideas */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <Reveal className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What it's built on
          </h2>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 md:gap-6">
          {coreIdeas.map((idea, i) => (
            <Reveal
              key={idea.title}
              delayMs={i * 90}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 sm:block sm:rounded-2xl sm:p-6"
            >
              <idea.icon className="size-5 shrink-0 text-primary sm:size-6" aria-hidden="true" />
              <h3 className="text-base font-semibold text-foreground sm:mt-4 sm:text-lg">
                {idea.title}
              </h3>
              <p className="mt-2 hidden text-sm leading-relaxed text-muted-foreground sm:block">
                {idea.description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Who Erth Is For */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Who it's for
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Built for anyone who cares about the places and moments that shape a life, and for
              those evaluating where the product is headed.
            </p>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {audiences.map((a, i) => (
              <Reveal
                key={a.title}
                delayMs={i * 70}
                className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card p-4 sm:items-start sm:gap-4 sm:rounded-2xl sm:p-6"
              >
                <a.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
                  <p className="mt-1 hidden text-sm leading-relaxed text-muted-foreground sm:block">
                    {a.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Download */}
      <section
        id="download"
        tabIndex={-1}
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 focus:outline-none sm:py-20"
      >
        <Reveal className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Download the app
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Bring your world with you. Get the app on your phone to start mapping the places and
            moments that matter.
          </p>
        </Reveal>
        <Reveal>
          <QrDownload />
        </Reveal>
      </section>
    </>
  );
}
