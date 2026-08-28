import { describe, expect, it } from 'vitest';
import { defaultSettings, hashSeed, isWithinNightSchedule, randomFrom, readSettings, seedOfDay } from '../src/core';

describe('deterministic scene seeds', () => {
  it('hashes identical labels to identical numbers', () => {
    expect(hashSeed('2026-08-27:moon-tide')).toBe(hashSeed('2026-08-27:moon-tide'));
    expect(hashSeed('2026-08-27:moon-tide')).not.toBe(hashSeed('2026-08-28:moon-tide'));
  });

  it('produces a repeatable pseudo-random sequence', () => {
    const one = randomFrom(421);
    const two = randomFrom(421);
    expect([one(), one(), one()]).toEqual([two(), two(), two()]);
  });

  it('creates local calendar seeds without a timezone shift', () => {
    expect(seedOfDay(new Date(2026, 7, 7, 23, 59))).toBe('2026-08-07');
  });
});

describe('night dim schedule', () => {
  it('supports schedules spanning midnight', () => {
    expect(isWithinNightSchedule(new Date(2026, 7, 27, 23, 0), '22:00', '07:00')).toBe(true);
    expect(isWithinNightSchedule(new Date(2026, 7, 27, 6, 59), '22:00', '07:00')).toBe(true);
    expect(isWithinNightSchedule(new Date(2026, 7, 27, 12, 0), '22:00', '07:00')).toBe(false);
  });

  it('supports daytime schedules and treats equal endpoints as all day', () => {
    expect(isWithinNightSchedule(new Date(2026, 7, 27, 12, 0), '09:00', '17:00')).toBe(true);
    expect(isWithinNightSchedule(new Date(2026, 7, 27, 18, 0), '09:00', '17:00')).toBe(false);
    expect(isWithinNightSchedule(new Date(), '08:00', '08:00')).toBe(true);
  });
});

describe('saved settings', () => {
  it('merges partial values with safe defaults', () => {
    const storage = { getItem: () => JSON.stringify({ clock: false, maxFps: 24 }) };
    expect(readSettings(storage)).toEqual({ ...defaultSettings, clock: false, maxFps: 24 });
  });

  it('falls back when saved data is corrupt', () => {
    expect(readSettings({ getItem: () => '{nope' })).toEqual(defaultSettings);
  });

  it('reads an explicit isolated storage key', () => {
    let requestedKey = '';
    const storage = { getItem: (key: string) => { requestedKey = key; return JSON.stringify({ clock: false }); } };
    expect(readSettings(storage, 'demo:wallpage:settings').clock).toBe(false);
    expect(requestedKey).toBe('demo:wallpage:settings');
  });
});
