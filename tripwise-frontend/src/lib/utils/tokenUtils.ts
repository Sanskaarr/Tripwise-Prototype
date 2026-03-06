/**
 * Decode a JWT token payload without a library.
 * Returns null if the token is malformed.
 */
function decodeToken(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(payload);
    } catch {
        return null;
    }
}

/**
 * Check if a JWT token is expired.
 * Returns true if expired, malformed, or missing.
 * Includes a 30-second buffer to avoid edge-case failures.
 */
export function isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    const payload = decodeToken(token);
    if (!payload || typeof payload.exp !== 'number') return true;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < nowInSeconds + 30; // 30s buffer
}

/**
 * Quick check: is the token valid (present + not expired)?
 */
export function isTokenValid(token: string | null): boolean {
    return !isTokenExpired(token);
}
