jest.mock("@/lib/site-config", () => ({
  siteConfig: { siteMode: "beta" },
}));

import { getSitemapPaths, isBetaMode, isLiveMode } from "@/lib/site-mode";

describe("site mode", () => {
  it("keeps acquisition and marketing routes out of the closed-beta sitemap", () => {
    const paths = getSitemapPaths("beta");

    expect(paths).toEqual(["/", "/testing/guide", "/report", "/legal"]);
    expect(paths).not.toContain("/features");
    expect(paths).not.toContain("/contact");
  });

  it("restores the public product surface in live mode", () => {
    expect(getSitemapPaths("live")).toEqual([
      "/",
      "/features",
      "/about",
      "/updates",
      "/report",
      "/contact",
      "/legal",
    ]);
  });

  it("exposes explicit mode predicates", () => {
    expect(isBetaMode("beta")).toBe(true);
    expect(isLiveMode("live")).toBe(true);
    expect(isBetaMode("live")).toBe(false);
  });
});
