import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { LegalLayout, type LegalSection } from "@/components/legal-layout";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildPageHead({
      title: "Terms of Service — Erth",
      description:
        "The terms that govern your use of Erth, including accounts, acceptable use, and limitations of liability.",
      path: "/terms",
    }),
  component: TermsPage,
});

const contactLine = siteConfig.contact.email
  ? siteConfig.contact.email
  : "[contact email — to be confirmed]";

const sections: LegalSection[] = [
  {
    id: "acceptance",
    heading: "Acceptance of terms",
    body: (
      <p>
        By accessing or using Erth, you agree to these Terms of Service. If you
        do not agree, do not use the service.
      </p>
    ),
  },
  {
    id: "eligibility",
    heading: "Eligibility",
    body: (
      <p className="italic">
        [Placeholder — confirm the minimum age and any eligibility requirements
        for using Erth.]
      </p>
    ),
  },
  {
    id: "accounts",
    heading: "Accounts",
    body: (
      <p>
        You are responsible for the activity on your account and for keeping your
        credentials secure. You agree to provide accurate information and to keep
        it up to date.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    heading: "Acceptable use",
    body: (
      <p>
        You agree not to misuse Erth — including unlawful activity, infringing
        others' rights, or attempting to disrupt or compromise the service.{" "}
        <span className="italic">
          [Placeholder — confirm the full list of prohibited conduct.]
        </span>
      </p>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    body: (
      <p>
        You retain rights to the content you create. Erth and its branding remain
        the property of Erth.{" "}
        <span className="italic">
          [Placeholder — confirm the content license you grant to operate the
          service.]
        </span>
      </p>
    ),
  },
  {
    id: "third-party-services",
    heading: "Third-party services",
    body: (
      <p className="italic">
        [Placeholder — describe reliance on third-party services such as hosting
        and app stores, and their applicable terms.]
      </p>
    ),
  },
  {
    id: "availability",
    heading: "Service availability",
    body: (
      <p>
        We aim to keep Erth available and reliable, but we do not guarantee
        uninterrupted access and may modify or discontinue features.
      </p>
    ),
  },
  {
    id: "disclaimers",
    heading: "Disclaimers",
    body: (
      <p className="italic">
        [Placeholder — standard "as is" disclaimer of warranties, to be confirmed
        by legal review.]
      </p>
    ),
  },
  {
    id: "limitation-of-liability",
    heading: "Limitation of liability",
    body: (
      <p className="italic">
        [Placeholder — limitation of liability, to be confirmed by legal review
        and adapted to applicable jurisdictions.]
      </p>
    ),
  },
  {
    id: "termination",
    heading: "Termination",
    body: (
      <p>
        You may stop using Erth at any time. We may suspend or terminate access
        if these terms are violated.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. Material changes will be
        communicated through the app or by email.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: <p>Questions about these terms can be directed to {contactLine}.</p>,
  },
];

function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      isPlaceholder={siteConfig.legal.termsIsPlaceholder}
      intro={
        <p>
          These Terms of Service govern your use of Erth. Please read them
          carefully — they explain your responsibilities and the rules for using
          the service.
        </p>
      }
      sections={sections}
    />
  );
}
