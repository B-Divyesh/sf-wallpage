export type StoredSettings = {
  clock: boolean;
  date: boolean;
  rotationMinutes: number;
  maxFps: number;
  brightness: number;
  nightDim: boolean;
  dimStart: string;
  dimEnd: string;
  seenWelcome: boolean;
};

export const defaultSettings: StoredSettings = {
  clock: true,
  date: true,
  rotationMinutes: 5,
  maxFps: 30,
  brightness: 1,
  nightDim: false,
  dimStart: '22:00',
  dimEnd: '07:00',
  seenWelcome: false,
};

export function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function randomFrom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedOfDay(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function minutes(value: string): number {
  const [hours = 0, mins = 0] = value.split(':').map(Number);
  return hours * 60 + mins;
}

export function isWithinNightSchedule(now: Date, start: string, end: string): boolean {
  const current = now.getHours() * 60 + now.getMinutes();
  const from = minutes(start);
  const to = minutes(end);
  if (from === to) return true;
  return from < to ? current >= from && current < to : current >= from || current < to;
}

export function readSettings(storage: Pick<Storage, 'getItem'> | null, key = 'wallpage:settings'): StoredSettings {
  if (!storage) return { ...defaultSettings };
  try {
    const saved = JSON.parse(storage.getItem(key) ?? '{}') as Partial<StoredSettings>;
    return { ...defaultSettings, ...saved };
  } catch {
    return { ...defaultSettings };
  }
}
