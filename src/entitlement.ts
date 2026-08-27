export const LICENSE_STORAGE_KEY = 'sb_license:wallpage';

export type EntitlementReason = 'ok' | 'invalid' | 'expired' | 'revoked' | 'wrong_product' | 'error' | 'offline' | 'unconfigured';

export type EntitlementVerdict = {
  valid: boolean;
  reason: EntitlementReason;
  expiresAt?: string;
};

type VerifyResponse = {
  valid?: boolean;
  reason?: string;
  expires_at?: string;
};

const knownReasons = new Set<EntitlementReason>(['ok', 'invalid', 'expired', 'revoked', 'wrong_product']);

/**
 * Adds a license to the deployment-supplied Sociobot verifier URL. The URL is
 * public configuration, not a credential; licenses are never put in URLs we
 * render, share, or cache.
 */
export function verifierRequestUrl(verifierUrl: string | undefined, license: string): string | null {
  if (!verifierUrl || !license.trim()) return null;
  try {
    const url = new URL(verifierUrl);
    if (url.protocol !== 'https:') return null;
    url.searchParams.set('license', license.trim());
    return url.toString();
  } catch {
    return null;
  }
}

export function parseEntitlementResponse(response: VerifyResponse, responseOk: boolean): EntitlementVerdict {
  const reason = knownReasons.has(response.reason as EntitlementReason)
    ? response.reason as EntitlementReason
    : 'error';
  if (!responseOk && reason === 'ok') return { valid: false, reason: 'error', expiresAt: typeof response.expires_at === 'string' ? response.expires_at : undefined };
  const valid = responseOk && response.valid === true && reason === 'ok';
  return { valid, reason: valid ? 'ok' : reason, expiresAt: typeof response.expires_at === 'string' ? response.expires_at : undefined };
}

export async function verifyEntitlement(
  license: string,
  verifierUrl: string | undefined,
  fetcher: typeof fetch = fetch,
): Promise<EntitlementVerdict> {
  const url = verifierRequestUrl(verifierUrl, license);
  if (!url) return { valid: false, reason: 'unconfigured' };
  try {
    const response = await fetcher(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      credentials: 'omit',
    });
    let body: VerifyResponse = {};
    try { body = await response.json() as VerifyResponse; } catch { /* handled as an error verdict */ }
    return parseEntitlementResponse(body, response.ok);
  } catch {
    return { valid: false, reason: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'error' };
  }
}
