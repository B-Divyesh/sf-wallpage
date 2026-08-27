export type SceneDefinition = {
  id: string;
  title: string;
  index: string;
  description: string;
  collector?: boolean;
};

// Keep the gallery index in the startup chunk. The Canvas algorithms live in
// their own on-demand chunk so the welcome screen is immediately usable on
// constrained TV and mobile browsers.
export const scenes: SceneDefinition[] = [
  { id: 'brackish-drift', index: '01', title: 'Brackish drift', description: 'Fine luminous currents wander through deep estuary water.' },
  { id: 'moon-tide', index: '02', title: 'Moon tide', description: 'Layered tidal contours move beneath a low copper moon.' },
  { id: 'quiet-duel', index: '03', title: 'Quiet duel', description: 'Two patient colonies trade a soft cellular frontier.' },
  { id: 'cloud-chamber', index: '04', title: 'Cloud chamber', description: 'Storm vapor gathers, opens, and dissolves in slow strata.' },
  { id: 'ember-bloom', index: '05', title: 'Ember bloom', description: 'A dark botanical flame draws itself from orbiting embers.' },
  { id: 'salt-constellation', index: '06', title: 'Salt constellation', description: 'Mineral points find temporary neighbors across a night basin.' },
  { id: 'kelp-current', index: '07', title: 'Kelp current', description: 'Long submerged ribbons lean into an unseen tide.' },
  { id: 'rain-archive', index: '08', title: 'Rain archive', description: 'Weather marks fall through a quiet field of reflected light.' },
  { id: 'fault-garden', index: '09', title: 'Fault garden', description: 'Collector scene — geological cells breathe along illuminated seams.', collector: true },
  { id: 'aurora-basin', index: '10', title: 'Aurora basin', description: 'Collector scene — veils of mineral light fold over a black horizon.', collector: true },
];
