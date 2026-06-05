import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, Download } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { vision, coreIdeas, audiences } from "@/lib/erth-content";
import { Reveal } from "@/components/reveal";
import { HeroVisual } from "@/components/hero-visual";
import { QrDownload } from "@/components/qr-download";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      title: "Erth — A living digital map of your world",
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
      const reduce = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;
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

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28">
          <div className="grid items-center gap-12 md:grid-cols-[1.15fr_1fr]">
            <Reveal className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Erth
              </p>
              <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {siteConfig.oneLiner}
              </h1>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {siteConfig.visionStatement}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/"
                  hash="download"
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download the app
                </Link>
                <Link
                  to="/about"
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Learn about Erth
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>

            <Reveal delayMs={120} className="flex justify-center text-foreground">
              <HeroVisual className="w-full max-w-sm" />
            </Reveal>
          </div>
        </div>
      </section>


      {/* Our Vision */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <Reveal className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Our vision
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {vision.problem}
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              {vision.why}
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              {vision.future}
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              {vision.contribution}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Ideas */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What Erth is built on
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {coreIdeas.map((idea, i) => (
            <Reveal
              key={idea.title}
              delayMs={i * 90}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <idea.icon className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {idea.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {idea.description}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Who Erth Is For */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Who Erth is for
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Erth is built for anyone who cares about the places and moments
              that shape a life — and for those evaluating where it is headed.
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a, i) => (
              <Reveal
                key={a.title}
                delayMs={i * 70}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <a.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 focus:outline-none"
      >
        <Reveal className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Download Erth
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Bring your world with you. Get Erth on your phone to start mapping
            the places and moments that matter.
          </p>
        </Reveal>
        <Reveal>
          <QrDownload />
        </Reveal>
      </section>
    </>
  );
}
