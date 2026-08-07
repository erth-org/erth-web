import "@testing-library/jest-dom";

Object.defineProperty(window, "scrollTo", { value: jest.fn(), writable: true });
Object.defineProperty(window, "print", { value: jest.fn(), writable: true });

if (!globalThis.crypto.randomUUID) {
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    value: () => "00000000-0000-4000-8000-000000000000",
  });
}
