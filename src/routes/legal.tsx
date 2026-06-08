import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { LegalLayout, type LegalSection } from "@/components/legal-layout";

export const Route = createFileRoute("/legal")({
  head: () =>
    buildPageHead({
      title: "Legal — Erth",
      description: "Privacy Policy and Terms & Conditions for Erth.",
      path: "/legal",
    }),
  component: LegalPage,
});

const contactLine = siteConfig.contact.email || "contact@erth.app";

const privacySections: LegalSection[] = [
  {
    id: "privacy-information",
    heading: "Information we collect",
    body: (
      <p>
        [Demo legal content] The app may collect account details, saved place content, location
        context you choose to add, and limited technical data needed to keep the service reliable.
        Final categories must be confirmed before production.
      </p>
    ),
  },
  {
    id: "privacy-use",
    heading: "How information is used",
    body: (
      <p>
        [Demo legal content] Information is used to operate the product, keep accounts secure,
        preserve user-created experiences, improve performance, and communicate service updates.
      </p>
    ),
  },
  {
    id: "privacy-rights",
    heading: "Your rights and choices",
    body: (
      <p>
        [Demo legal content] Users may request access, correction, deletion, export, or restriction
        of personal data by contacting {contactLine}. GDPR-specific handling requires legal review.
      </p>
    ),
  },
];

const termsSections: LegalSection[] = [
  {
    id: "terms-acceptance",
    heading: "Acceptance",
    body: (
      <p>
        [Demo legal content] By using the service, you agree to these Terms & Conditions. If you do
        not agree, you should not use the service.
      </p>
    ),
  },
  {
    id: "terms-acceptable-use",
    heading: "Acceptable use",
    body: (
      <p>
        [Demo legal content] Users must not misuse the service, infringe others' rights, upload
        unlawful content, or attempt to disrupt or compromise the platform.
      </p>
    ),
  },
  {
    id: "terms-ownership",
    heading: "Content and ownership",
    body: (
      <p>
        [Demo legal content] Users retain ownership of the content they create. The service needs a
        limited license to store, process, and display that content as part of the product.
      </p>
    ),
  },
];

function SectionList({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="space-y-2">
          <h3 id={section.id} className="text-base font-semibold tracking-tight text-foreground">
            {section.heading}
          </h3>
          <div className="text-muted-foreground">{section.body}</div>
        </section>
      ))}
    </div>
  );
}

function LegalPage() {
  return (
    <LegalLayout
      title="Legal"
      isPlaceholder={siteConfig.legal.privacyIsPlaceholder || siteConfig.legal.termsIsPlaceholder}
      intro={
        <div className="space-y-4">
          <p>
            This page combines the Privacy Policy and Terms & Conditions so legal information stays
            in one clear place. The content below is demo structure for review and must be replaced
            with approved legal copy before production.
          </p>
          <p className="font-mono text-xs uppercase tracking-wider text-primary">
            Demo content — not legal advice or published production copy
          </p>
        </div>
      }
      sections={[
        {
          id: "privacy-policy",
          heading: "Privacy Policy",
          body: (
            <div className="space-y-5">
              <p>
                This section explains how personal data is collected, used, retained, and protected.
                It is grouped here so the privacy policy reads as one complete policy rather than
                scattered legal fragments.
              </p>
              <SectionList sections={privacySections} />
            </div>
          ),
        },
        {
          id: "terms-conditions",
          heading: "Terms & Conditions",
          body: (
            <div className="space-y-5">
              <p>
                This section covers the rules and responsibilities that apply when using the
                service.
              </p>
              <SectionList sections={termsSections} />
            </div>
          ),
        },
        {
          id: "other-notices",
          heading: "Other Notices",
          body: (
            <div className="space-y-5">
              <section aria-labelledby="legal-status" className="space-y-2">
                <h3
                  id="legal-status"
                  className="text-base font-semibold tracking-tight text-foreground"
                >
                  Legal review status
                </h3>
                <p>
                  [Demo legal content] This legal page is pending final review. Placeholder copy
                  must be replaced with approved production language before launch.
                </p>
              </section>
              <section aria-labelledby="legal-contact" className="space-y-2">
                <h3
                  id="legal-contact"
                  className="text-base font-semibold tracking-tight text-foreground"
                >
                  Contact
                </h3>
                <p>Questions about this legal content can be directed to {contactLine}.</p>
              </section>
            </div>
          ),
        },
      ]}
    />
  );
}
