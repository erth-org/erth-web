import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/legal")({
  head: () =>
    buildPageHead({
      title: "Legal - Erth",
      description: "Legal information for Erth. Final legal copy is pending review.",
      path: "/legal",
    }),
  component: LegalPage,
});

function LegalPage() {
  const contactEmail = siteConfig.contact.email;

  return (
    <LegalLayout
      title="Legal"
      intro={
        <div className="space-y-4">
          <p className="text-base text-foreground/90">
            Final legal documents are being prepared for Erth's private beta and wider release.
          </p>
          <p>
            This page will contain Erth's Privacy Policy, Terms and Conditions, and related notices.
          </p>
          <p>
            Because Erth is currently in private TestFlight beta, final public legal copy is still
            pending review. For questions about privacy, data handling, or beta participation,
            contact the Erth team directly.
          </p>
          <p>
            <a
              href={`mailto:${contactEmail}`}
              className="underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {contactEmail}
            </a>
          </p>
        </div>
      }
      sections={[
        {
          id: "privacy-policy",
          heading: "Privacy Policy",
          body: <p>Final copy pending legal review.</p>,
        },
        {
          id: "terms-conditions",
          heading: "Terms and Conditions",
          body: <p>Final copy pending legal review.</p>,
        },
        {
          id: "other-notices",
          heading: "Other Notices",
          body: <p>Final copy pending legal review.</p>,
        },
      ]}
    />
  );
}
