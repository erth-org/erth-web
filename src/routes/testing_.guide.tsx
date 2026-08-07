import { createFileRoute } from "@tanstack/react-router";
import { TesterGuideExperience } from "@/components/testing-guide/tester-guide-experience";
import { TesterGuideProvider } from "@/components/testing-guide/tester-guide-provider";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/testing_/guide")({
  head: () => {
    const head = buildPageHead({
      title: "Beta Tester Guide - Erth",
      description:
        "A private-beta testing guide for sharing structured feedback about the Erth travel experience.",
      path: "/testing/guide",
    });
    return {
      ...head,
      meta: [...head.meta, { name: "robots", content: "noindex, nofollow" }],
    };
  },
  component: TesterGuideRoute,
});

function TesterGuideRoute() {
  return (
    <TesterGuideProvider>
      <TesterGuideExperience />
    </TesterGuideProvider>
  );
}
