import { createHash } from 'node:crypto';

/** The shell's fingerprint changes whenever its emitted HTML or asset URLs change. */
export function releaseIdForShell(html: string): string {
  return createHash('sha256').update(html).digest('hex').slice(0, 12);
}
