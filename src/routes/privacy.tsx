import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { LegalLayout, type LegalSection } from "@/components/legal-layout";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildPageHead({
      title: "Privacy Policy — Erth",
      description:
        "How Erth collects, uses, retains, and protects your information, including your rights under GDPR/EU law.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

const contactLine = siteConfig.contact.email
  ? siteConfig.contact.email
  : "[contact email — to be confirmed]";

const sections: LegalSection[] = [
  {
    id: "information-we-collect",
    heading: "Information we collect",
    body: (
      <>
        <p>
          Erth is a place-based experience app. To provide it, we collect
          account information you provide (such as your name and email), the
          content you choose to capture (including notes, media, and the
          locations you attach to them), and limited technical and device data
          needed to operate the service.
        </p>
        <p className="italic">
          [Placeholder — confirm the exact categories of data the app collects,
          including any precise or approximate location data and how it is
          obtained.]
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    heading: "How we use your information",
    body: (
      <p>
        We use your information to operate and improve Erth, to store and
        display the experiences you create, to keep your account secure, and to
        communicate with you about the service.{" "}
        <span className="italic">
          [Placeholder — confirm each purpose and the corresponding legal basis
          under GDPR Art. 6.]
        </span>
      </p>
    ),
  },
  {
    id: "data-processors",
    heading: "Data processors and sharing",
    body: (
      <p>
        We rely on third-party service providers (for example, cloud hosting and
        storage) that process data on our behalf under contract. We do not sell
        your personal data.{" "}
        <span className="italic">
          [Placeholder — list the actual processors/sub-processors, their roles,
          and any international transfer safeguards.]
        </span>
      </p>
    ),
  },
  {
    id: "data-retention",
    heading: "Data retention",
    body: (
      <p>
        We keep your information for as long as your account is active or as
        needed to provide the service.{" "}
        <span className="italic">
          [Placeholder — confirm concrete retention periods per data category and
          deletion timelines.]
        </span>
      </p>
    ),
  },
  {
    id: "account-deletion",
    heading: "Account deletion",
    body: (
      <p>
        You can request deletion of your account and associated personal data at
        any time by contacting us at {contactLine}. We will delete or anonymize
        your data within the timeframe required by applicable law.{" "}
        <span className="italic">
          [Placeholder — confirm in-app deletion flow and exact timelines.]
        </span>
      </p>
    ),
  },
  {
    id: "your-rights",
    heading: "Your rights (GDPR/EU)",
    body: (
      <p>
        If you are in the EU/EEA, you have the right to access, rectify, erase,
        restrict, and port your personal data, and to object to certain
        processing. You may also withdraw consent and lodge a complaint with
        your supervisory authority.{" "}
        <span className="italic">
          [Placeholder — confirm how each right is exercised and response
          timelines.]
        </span>
      </p>
    ),
  },
  {
    id: "security",
    heading: "Security",
    body: (
      <p>
        We use technical and organizational measures designed to protect your
        information. No method of transmission or storage is completely secure.{" "}
        <span className="italic">[Placeholder — summarize key safeguards.]</span>
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    heading: "Children's privacy",
    body: (
      <p className="italic">
        [Placeholder — state the minimum age and how the service handles
        children's data in line with GDPR Art. 8 and local law.]
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. Material changes will be
        communicated through the app or by email.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Questions about this policy or your data can be directed to {contactLine}.
      </p>
    ),
  },
];

function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      isPlaceholder={siteConfig.legal.privacyIsPlaceholder}
      intro={
        <p>
          This Privacy Policy explains how Erth handles personal data. It is
          structured around how the app actually works — the information it
          collects, how it is used and shared, how long it is kept, and the
          rights you have, including under EU data protection law.
        </p>
      }
      sections={sections}
    />
  );
}
