import { describe, expect, it } from 'vitest';
import { parseEntitlementResponse, verifierRequestUrl } from '../src/entitlement';
import { releaseIdForShell } from '../src/release';

describe('Collector entitlement protocol', () => {
  it('uses the configured verifier URL and keeps the token out of app URLs', () => {
    const request = verifierRequestUrl('https://api.sociobot.in/api/v1/products/wallpage/verify?source=wallpage', 'signed-token+/=');
    expect(request).toBe('https://api.sociobot.in/api/v1/products/wallpage/verify?source=wallpage&license=signed-token%2B%2F%3D');
    expect(verifierRequestUrl('http://api.sociobot.in/verify', 'signed-token')).toBeNull();
  });

  it('accepts only an explicit positive server entitlement', () => {
    expect(parseEntitlementResponse({ valid: true, reason: 'ok', expires_at: '2030-01-01T00:00:00Z' }, true)).toEqual({ valid: true, reason: 'ok', expiresAt: '2030-01-01T00:00:00Z' });
    expect(parseEntitlementResponse({ valid: true, reason: 'invalid' }, true)).toEqual({ valid: false, reason: 'invalid', expiresAt: undefined });
    expect(parseEntitlementResponse({ valid: false, reason: 'expired' }, true)).toEqual({ valid: false, reason: 'expired', expiresAt: undefined });
    expect(parseEntitlementResponse({ valid: true, reason: 'ok' }, false)).toEqual({ valid: false, reason: 'error', expiresAt: undefined });
  });
});

describe('release-derived PWA shell identity', () => {
  it('changes when build A shell content changes for build B', () => {
    expect(releaseIdForShell('<script src="/assets/app-a.js"></script>')).not.toBe(releaseIdForShell('<script src="/assets/app-b.js"></script>'));
  });
});
