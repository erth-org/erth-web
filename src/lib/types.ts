// Shared types for the Erth website.

export interface NavItem {
  label: string;
  to: string;
  /** Optional in-page hash target on the home route. */
  hash?: string;
}
