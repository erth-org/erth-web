import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";
import { updates } from "@/content/updates";

export const Route = createFileRoute("/updates")({
  head: () =>
    buildPageHead({
      title: "Updates — Erth release notes",
      description:
        "Release notes, improvements, and fixes for the Erth application.",
      path: "/updates",
    }),
  component: UpdatesPage,
});

function UpdatesPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-20 pb-12 sm:pt-28">
          <Reveal className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Release notes
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Updates to Erth
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              A running log of what's shipped, improved, and fixed in the Erth
              app — straight from the team.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24">
        {updates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
            <p className="text-base font-medium text-foreground">
              No releases yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Release notes will appear here when the next Erth version is
              published.
            </p>
          </div>
        ) : (
          <ol className="relative space-y-10 border-l border-border/60 pl-6">
            {updates.map((u) => (
              <li key={u.version} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[29px] top-2 size-2.5 rounded-full bg-primary ring-4 ring-background"
                />
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {u.version}
                  </h2>
                  <time
                    dateTime={u.releaseDate}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {u.releaseDate}
                  </time>
                  {u.platforms && u.platforms.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      · {u.platforms.join(", ")}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {u.summary}
                </p>
                {(["added", "improved", "fixed"] as const).map((key) => {
                  const list = u[key];
                  if (!list || list.length === 0) return null;
                  const label =
                    key === "added"
                      ? "New"
                      : key === "improved"
                        ? "Improved"
                        : "Fixed";
                  return (
                    <div key={key} className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
                        {label}
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {list.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                {u.link && (
                  <a
                    href={u.link}
                    className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
                  >
                    More details
                  </a>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
