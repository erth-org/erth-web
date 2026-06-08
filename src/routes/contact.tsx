import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Send } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StarBackdrop } from "@/components/star-backdrop";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildPageHead({
      title: "Contact — Erth",
      description: "Contact the Erth team with questions, partnerships, support, or feedback.",
      path: "/contact",
    }),
  component: ContactPage,
});

const CONTACT_STORAGE_KEY = "erth-demo-contact-messages";

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const message = {
      id: `contact-${Date.now()}`,
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      topic: String(data.get("topic") ?? ""),
      message: String(data.get("message") ?? ""),
      submittedAt: new Date().toISOString(),
    };
    const previous = JSON.parse(localStorage.getItem(CONTACT_STORAGE_KEY) ?? "[]");
    localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify([message, ...previous].slice(0, 20)));
    setSent(true);
    form.reset();
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <StarBackdrop />
        <div className="relative mx-auto max-w-3xl px-4 pt-20 pb-12 sm:pt-28">
          <Reveal className="space-y-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Contact
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Talk to the team
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Send questions, partnership notes, support requests, or product feedback. This demo
              form stores messages locally so the flow can be tested without a backend.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Mail className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">General contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Demo inbox: contact@erth.app
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <MessageSquare className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">Response scope</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Use this page for product questions, partnerships, press, or support routing.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6">
            {sent && (
              <p
                role="status"
                className="mb-5 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm text-foreground"
              >
                Demo message saved locally.
              </p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" htmlFor="contact-name">
                <input
                  id="contact-name"
                  name="name"
                  required
                  maxLength={80}
                  className={inputClass}
                />
              </Field>
              <Field label="Email" htmlFor="contact-email">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={120}
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Topic" htmlFor="contact-topic">
                <select id="contact-topic" name="topic" required className={inputClass}>
                  <option value="">Select a topic</option>
                  <option value="support">Support</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="press">Press</option>
                  <option value="feedback">Product feedback</option>
                </select>
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Message" htmlFor="contact-message">
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  maxLength={1800}
                  className={`${inputClass} min-h-36`}
                />
              </Field>
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Send className="size-4" aria-hidden="true" />
              Send message
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
