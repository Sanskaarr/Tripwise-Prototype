// Shared mutable flag — tracks whether we've successfully validated the
// browser session against the server this page load. Reset to false whenever
// the server returns a 401 so the next ProtectedRoute mount re-validates
// instead of trusting stale persisted state.
export const sessionCheckState = { validated: false };
