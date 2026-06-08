import { absoluteUrl } from "@/lib/site-config";

interface HeadInput {
  title: string;
  description: string;
  /** Route path, e.g. "/about". Used for canonical + og:url. */
  path: string;
}

interface MetaTag {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
}

interface LinkTag {
  rel: string;
  href: string;
}

/**
 * Builds per-route head metadata.
 * - Canonical and og:url/twitter URLs are emitted ONLY as absolute URLs,
 *   and only when productionUrl is configured (see site-config).
 * - No og:image is emitted unless an absolute image URL is available.
 */
export function buildPageHead({ title, description, path }: HeadInput): {
  meta: MetaTag[];
  links: LinkTag[];
} {
  const canonical = absoluteUrl(path);
  const socialImage = absoluteUrl("brand/erth-logo.png");

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (canonical) {
    meta.push({ property: "og:url", content: canonical });
  }

  if (socialImage) {
    meta.push(
      { property: "og:image", content: socialImage },
      { name: "twitter:image", content: socialImage },
    );
  }

  const links: LinkTag[] = canonical ? [{ rel: "canonical", href: canonical }] : [];

  return { meta, links };
}
