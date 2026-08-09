import { createFileRoute } from "@tanstack/react-router";
import { BetaHomePage } from "@/components/home/beta-home-page";
import { LiveHomePage } from "@/components/home/live-home-page";
import { buildPageHead } from "@/lib/seo";
import { isBetaMode } from "@/lib/site-mode";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead(
      isBetaMode()
        ? {
            title: "Erth closed beta tester guide",
            description:
              "The companion guide for invited Erth beta testers to complete missions and report app issues.",
            path: "/",
          }
        : {
            title: "Erth",
            description:
              "Erth turns trips, moments, and memories into a living 3D globe of your travel identity.",
            path: "/",
          },
    ),
  component: HomePage,
});

function HomePage() {
  return isBetaMode() ? <BetaHomePage /> : <LiveHomePage />;
}
