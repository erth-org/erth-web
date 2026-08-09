import { createFileRoute, redirect } from "@tanstack/react-router";
import { isBetaMode } from "@/lib/site-mode";

export const Route = createFileRoute("/testing")({
  beforeLoad: () => {
    throw redirect({ to: isBetaMode() ? "/testing/guide/" : "/" });
  },
});
