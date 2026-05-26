// Shared mutable flag — tracks whether we've successfully validated the
// browser session against the server this page load. Reset to false whenever
// the server returns a 401 so the next ProtectedRoute mount re-validates
// instead of trusting stale persisted state.
//
// onUnauthorized: registered by profileStore so the 401 interceptor in
// client.ts can call logout() synchronously — no dynamic import, no async
// delay that lets ProtectedRoute render a protected page before the store
// marks the user as logged out.
export const sessionCheckState = {
  validated: false,
  isVerifyingSession: false,
  onUnauthorized: null as (() => void) | null,
  // Cached JWT — set on login/session-validate, cleared on logout.
  // Used by the request interceptor to attach Authorization: Bearer so
  // cross-origin POSTs don't rely solely on the httpOnly cookie.
  token: null as string | null,
};
